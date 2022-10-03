RESOURCE_NAME = GetCurrentResourceName()
lib.locale()

CreateThread(function()
    if IsDuplicityVersion() then
        Server = {}
        TriggerEvent('ox_lib:setLocale', Config.locale)
    else
        Client = {
            isMenuOpen = false,
            currentTab = nil,
            lastCoords = nil,
            lastLocation = json.decode(GetResourceKvpString('dmt_lastLocation')),
            portalPoly = false,
            portalLines = false,
            portalCorners = false,
            portalInfos = false,
            interiorId = GetInteriorFromEntity(cache.ped)
        }

        lib.callback('dmt:getLocations', false, function(locations)
            Client.locations = locations
        end)

        lib.callback('dmt:getPedList', false, function(pedLists)
            Client.pedLists = pedLists
        end)

        CreateThread(function()
            while true do
                Wait(100)
                Client.interiorId = GetInteriorFromEntity(cache.ped)
            end
        end)
    end
end)

