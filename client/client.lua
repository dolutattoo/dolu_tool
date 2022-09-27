local function openUI()
    Client.locations = lib.callback.await('dmt:getLocations')
    Client.pedLists = lib.callback.await('dmt:getPedList')
    SendNUIMessage({
        action = 'setMenuVisible',
        data = {locations = Client.locations, pedLists = Client.pedLists}
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

RegisterNUICallback('teleportToLocation', function(data)
    FUNC.teleportPlayer({ x = data.x, y = data.y, z = data.z, heading = data.heading })
end)

RegisterNUICallback('dmt:changePed', function(data)
    FUNC.changePed(data.name)
end)

RegisterNUICallback('exit', function()
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    isMenuOpen = false
end)


RegisterNUICallback('changeLocationName', function(data)
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
end)

RegisterNUICallback('createCustomLocation', function(locationName)
    local playerPed = PlayerPedId()
    lib.callback('dmt:createCustomLocation', false, function(result)
        if not result then
            print('^2[DoluMappingTool] ^1 Error while trying to create location.^7')
        end

        table.insert(Client.locations.custom, 1, result)

        SendNUIMessage({
            action = 'setLocationDatas',
            data = Client.locations
        })
    end, { name = locationName, coords = GetEntityCoords(playerPed), heading = GetEntityHeading(playerPed) })
end)

RegisterNUICallback('setWeather', function(weatherName)
    FUNC.setWeather(weatherName)
end)

RegisterNUICallback('setClock', function(clock)
    local newTime = FUNC.stringSplit(clock:sub(12, 16), ':')
    FUNC.setClock(tonumber(newTime[1]), tonumber(newTime[2]))
end)

