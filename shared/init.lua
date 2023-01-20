RESOURCE_NAME = GetCurrentResourceName()

Shared = {}

if not GetResourceState('ox_lib'):find('start') then
    print('^1ox_lib should be started before this resource^0', 2)
end

if GetResourceState('ox_inventory'):find('start') then
    Shared.ox_inventory = true
end

lib.locale()

CreateThread(function()    
    if IsDuplicityVersion() then
        Server = {}
    else
        Client = {
            noClip = false,
            isMenuOpen = false,
            currentTab = 'home',
            lastLocation = json.decode(GetResourceKvpString('dolu_tool:lastLocation')),
            portalPoly = false,
            portalLines = false,
            portalCorners = false,
            portalInfos = false,
            interiorId = GetInteriorFromEntity(cache.ped),
            spawnedEntities = {},
            freezeTime = false,
            freezeWeather = false,
            data = {}
        }

        -- Get data from shared/data json files
        lib.callback('dolu_tool:getData', false, function(data)
            Client.data = data
        end)

        -- If ox_target is running, create targets
        if GetResourceState('ox_target'):find('start') then
            FUNC.initTarget()
        end

        -- Load locale
        RegisterNUICallback('loadLocale', function(_, cb)
            cb(1)
            local locale = Config.language or 'en'
            local JSON = LoadResourceFile(RESOURCE_NAME, ('locales/%s.json'):format(locale))
            if not JSON then
                JSON = LoadResourceFile(RESOURCE_NAME, 'locales/en.json')
                lib.notify({
                    type = 'error',
                    title = "Dolu Tool",
                    description = "'" .. locale .. "' locale not found, please contribute by adding your language",
                    duration = 10000
                })
            end
            SendNUIMessage({
                action = 'setLocale',
                data = json.decode(JSON)
            })
        end)

        CreateThread(function()
            FUNC.setMenuPlayerCoords()
            while true do
                Wait(150)
                Client.interiorId = GetInteriorFromEntity(cache.ped)
            end
        end)

        if not Config.development then
            SetTimeout(1000, function()
                Client.version = lib.callback.await('dolu_tool:getVersion', false)
            end)
        end
    end
end)