Shared = {}

if not GetResourceState('ox_lib'):find('start') then
    print('^1[dolu_tool][error] ox_lib should be started before this resource^0', 2)
    if not lib or not cache then return end
end

if not LoadResourceFile(cache.resource, 'web/build/index.html') then
    local err = '^4[dolu_tool] ^1Unable to load UI. Build dolu_tool or download the latest release:\n  -> ^3https://github.com/dolutattoo/dolu_tool/releases/latest/download/dolu_tool.zip^0'
    Shared.isUiLoaded = false
    print(err)
else
    Shared.isUiLoaded = true
end


if GetResourceState('ox_inventory'):find('start') then
    Shared.ox_inventory = true
end

lib.locale()

if lib.context == 'server' then
    Server = {}
elseif lib.context == 'client' then
    if not Shared.isUiLoaded then
        lib.notify({
            type = 'error',
            icon = 'fa-solid fa-ban',
            title = 'Dolu Tool',
            description = 'Unable to load UI. Build dolu_tool or download the latest release',
            duration = 20000
        })
    end

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
        defaultTimecycles = {},
        spawnedEntities = {},
        freezeTime = false,
        freezeWeather = false,
        data = {}
    }

    -- Load locale
    RegisterNUICallback('loadLocale', function(_, cb)
        cb(1)
        local locale = Config.language or 'en'
        local JSON = LoadResourceFile(cache.resource, ('locales/%s.json'):format(locale))
        if not JSON then
            JSON = LoadResourceFile(cache.resource, 'locales/en.json')
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

    -- Get data from shared/data json files
    lib.callback('dolu_tool:getData', false, function(data)
        Client.data = data
    end)

    CreateThread(function()
        -- If ox_target is running, create targets
        if GetResourceState('ox_target'):find('start') then
            Utils.initTarget()
        end

        Utils.setMenuPlayerCoords()

        if not Config.development then
            SetTimeout(1000, function()
                Client.version = lib.callback.await('dolu_tool:getVersion', false)
            end)
        end

        while true do
            Wait(150)
            Client.interiorId = GetInteriorFromEntity(cache.ped)
        end
    end)
end
