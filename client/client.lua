RegisterNUICallback('dmt:tabSelected', function(data, cb)
    Client.currentTab = data

    if data == 'world' then
        local hour, minute = FUNC.getClock()

        SendNUIMessage({
            action = 'setWorldData',
            data = {
                clock = { hour = hour, minute = minute },
                weather = FUNC.getWeather()
            }
        })
    end
end)

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
    Client.currentTab = nil
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
    FUNC.setClock(clock.hour, clock.minute)
    cb(1)
end)

RegisterNUICallback('dmt:getClock', function(_, cb)
    local hour, minute = FUNC.getClock()
    SendNUIMessage({
        action = 'setClockData',
        data = {hour = hour, minute = minute }
    })
    cb(1)
end)
