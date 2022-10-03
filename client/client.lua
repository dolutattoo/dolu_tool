RegisterNUICallback('dmt:teleport', function(data, cb)
    FUNC.teleportPlayer({ x = data.x, y = data.y, z = data.z, heading = data.heading }, true)

    SendNUIMessage({
        action = 'setLastLocation',
        data = data
    })

    SetResourceKvp('dmt_lastLocation', json.encode(data))
    Client.lastLocation = json.encode(data)
    cb(1)
end)

RegisterNUICallback('dmt:changePed', function(data, cb)
    FUNC.changePed(data.name)
    cb(1)
end)

RegisterNUICallback('dmt:exit', function(_, cb)
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    Client.isMenuOpen = false
    cb(1)
end)

RegisterNUICallback('dmt:changeLocationName', function(data, cb)
    lib.callback('dmt:renameLocation', false, function(result)
        if not result then return end

        Client.locations[result.index] = result.data

        SendNUIMessage({
            action = 'setLocationDatas',
            data = Client.locations
        })
    end, data)
    cb(1)
end)

RegisterNUICallback('dmt:createCustomLocation', function(locationName, cb)
    local playerPed = cache.ped

    lib.callback('dmt:createCustomLocation', false, function(result)
        if not result then return end

        -- Insert new location at index 1
        table.insert(Client.locations, 1, result)

        SendNUIMessage({
            action = 'setLocationDatas',
            data = Client.locations
        })
    end, {
        name = locationName,
        coords = GetEntityCoords(playerPed),
        heading = GetEntityHeading(playerPed)
    })
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
