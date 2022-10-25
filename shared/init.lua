RESOURCE_NAME = GetCurrentResourceName()
lib.locale()

local ox_lib = 'ox_lib'

if not GetResourceState(ox_lib):find('start') then
    print('^1ox_lib should be started before this resource^0', 2)
end

CreateThread(function()
    if IsDuplicityVersion() then
        Server = {}
    else
        Client = {
            noClip = false,
            isMenuOpen = false,
            currentTab = 'home',
            lastLocation = json.decode(GetResourceKvpString('dmt_lastLocation')),
            portalPoly = false,
            portalLines = false,
            portalCorners = false,
            portalInfos = false,
            interiorId = GetInteriorFromEntity(cache.ped),
            spawnedEntities = {}
        }

        lib.callback('dmt:getLocations', false, function(locations)
            Client.locations = locations
        end)

        lib.callback('dmt:getPedList', false, function(pedLists)
            Client.pedLists = pedLists
        end)

        lib.callback('dmt:getVehicleList', false, function(vehicleLists)
            Client.vehicleLists = vehicleLists
        end)

        CreateThread(function()
            while true do
                Wait(100)
                Client.interiorId = GetInteriorFromEntity(cache.ped)
            end
        end)
    end
end)

