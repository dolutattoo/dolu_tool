local function openUI()
    Client.locations = lib.callback.await('dmt:getLocations')
    Client.pedLists = lib.callback.await('dmt:getPedList')
    SendNUIMessage({
        action = 'setMenuVisible',
        data = {
            locations = Client.locations,
            pedLists = Client.pedLists
        }
    })
    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(true)
    isMenuOpen = true
end

CreateThread(function()
    while true do
        GetInteriorData()
        if not IsNuiFocused() and not IsPauseMenuActive() then
            if IsControlJustPressed(0, 170) then -- F3
                openUI()
            end
        end
        Wait(0)
    end
end)

RegisterNUICallback('dmt:teleport', function(data, cb)
    FUNC.teleportPlayer({ x = data.x, y = data.y, z = data.z, heading = data.heading }, true)
    cb(1)
end)

RegisterNUICallback('dmt:changePed', function(data, cb)
    FUNC.changePed(data.name)
    cb(1)
end)

RegisterNUICallback('dmt:exit', function(_, cb)
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    isMenuOpen = false
    cb(1)
end)

RegisterNUICallback('dmt:changeLocationName', function(data, cb)
    lib.callback('dmt:renameLocation', false, function(result)
        if not result then
            print('^2[DoluMappingTool] ^1 Error while trying to rename location. Location not found!^7')
        end

        Client.locations.custom[result.index] = result.data

        SendNUIMessage({
            action = 'setLocationDatas',
            data = Client.locations
        })
    end, data)
    cb(1)
end)

RegisterNUICallback('dmt:createCustomLocation', function(locationName, cb)
    lib.callback('dmt:createCustomLocation', false, function(result)
        if not result then
            print('^2[DoluMappingTool] ^1 Error while trying to create location.^7')
        end

        table.insert(Client.locations.custom, 1, result)

        SendNUIMessage({
            action = 'setLocationDatas',
            data = Client.locations
        })
    end, { name = locationName, coords = GetEntityCoords(cache.ped), heading = GetEntityHeading(cache.ped) })
    cb(1)
end)

RegisterNUICallback('dmt:setWeather', function(weatherName, cb)
    FUNC.setWeather(weatherName)
    cb(1)
end)

RegisterNUICallback('dmt:setClock', function(clock, cb)
    local newTime = FUNC.stringSplit(clock:sub(12, 16), ':')

    CreateThread(function()
        while true do
            FUNC.setClock(newTime[1], newTime[2])
            Wait(0)
        end
    end)
    cb(1)
end)
