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
    SendNUIMessage({
        action = 'setGizmoEntity',
        data = { object = nil }
    })
    Client.gizmoEntity = nil
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

RegisterNUICallback('dmt:deleteLocation', function(locationName, cb)
    local result = lib.callback.await('dmt:deleteLocation', false, locationName)
    if not result then return end

    -- Remove location from file
    table.remove(Client.locations, result)

    SendNUIMessage({
        action = 'setLocationDatas',
        data = Client.locations
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

RegisterNUICallback('dmt:cleanZone', function(_, cb)
    local playerId = cache.ped
    local playerCoords = GetEntityCoords(playerId)
    ClearAreaOfEverything(playerCoords.x, playerCoords.y, playerCoords.z, 1000.0, false, false, false, false)
    cb(1)
end)

RegisterNUICallback('dmt:cleanPed', function(_, cb)
    local playerId = cache.ped
    ClearPedBloodDamage(playerId)
    ClearPedEnvDirt(playerId)
    ClearPedWetness(playerId)
    cb(1)
end)

RegisterNUICallback('dmt:cleanVehicle', function(_, cb)
    local vehicle = cache.vehicle
    SetVehicleDirtLevel(vehicle, 0.0)
    cb(1)
end)

RegisterNUICallback('dmt:repairVehicle', function(_, cb)
    local vehicle = cache.vehicle
	SetVehicleFixed(vehicle)
    SetVehicleEngineHealth(vehicle, 1000.0)
    SetVehicleDirtLevel(vehicle, 0.0)
    cb(1)
end)

RegisterNUICallback('dmt:giveAllWeapons', function(_, cb)
    cb(1)
end)

RegisterNUICallback('dmt:setDay', function(_, cb)
    FUNC.setClock(12)
    FUNC.setWeather('extrasunny')
    cb(1)
end)

RegisterNUICallback('dmt:spawnFavoriteVehicle', function(_, cb)
    FUNC.spawnVehicle('krieger')
    cb(1)
end)

RegisterNUICallback('dmt:addEntity', function(modelName, cb)
    local model = joaat(modelName)
    FUNC.assert(IsModelInCdimage(model) == false, "Model does not exist")

    local coords = GetEntityCoords(cache.ped)

    RequestModel(model)
    while not HasModelLoaded(model) do Wait(0) end

    local obj = CreateObject(model, coords.x, coords.y+2, coords.z)
    PlaceObjectOnGroundProperly(obj)
    FreezeEntityPosition(obj, true)

    local rotx, roty, rotz, rotw = GetEntityQuaternion(obj)

    table.insert(Client.spawnedEntities, 1, {
        handle = obj,
        name = modelName,
        position = {
            x = FUNC.round(coords.x, 3),
            y = FUNC.round(coords.y, 3),
            z = FUNC.round(coords.z, 3)
        },
        rotation = {
            x = FUNC.round(rotx, 3),
            y = FUNC.round(roty, 3),
            z = FUNC.round(rotz, 3),
            w = FUNC.round(rotw, 3)
        }
    })

    SendNUIMessage({
        action = 'setEntities',
        data = Client.spawnedEntities
    })

    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {
            name = modelName,
            handle = obj,
            position = GetEntityCoords(obj),
            rotation = GetEntityRotation(obj),
        }
    })
    Client.gizmoEntity = obj
    cb(1)
end)

RegisterNUICallback('dmt:setGizmoEntity', function(entity, cb)
    if entity and DoesEntityExist(entity.handle) then
        SendNUIMessage({
            action = 'setGizmoEntity',
            data = {
                name = entity.name,
                handle = entity.handle,
                position = GetEntityCoords(entity.handle),
                rotation = GetEntityRotation(entity.handle),
            }
        })
        Client.gizmoEntity = entity.handle
    else
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = "Entity does not exist!",
            type = 'error',
            position = 'top'
        })
    end
    cb(1)
end)

RegisterNUICallback('dmt:moveEntity', function(data, cb)
    if data.handle then
        SetEntityCoords(data.handle, data.position.x, data.position.y, data.position.z)
        SetEntityRotation(data.handle, data.rotation.x, data.rotation.y, data.rotation.z)

        SendNUIMessage({
            action = 'setEntities',
            data = Client.spawnedEntities
        })
    end
    cb(1)
end)

RegisterNUICallback('dmt:deleteEntity', function(entityHandle, cb)
    if not DoesEntityExist(entityHandle) then
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = "Entity does not exist!",
            type = 'error',
            position = 'top'
        })
        return
    end

    local foundIndex
    for k, entity in ipairs(Client.spawnedEntities) do
        if entity.handle == entityHandle then
            foundIndex = k
            break
        end
    end

    if foundIndex then
        DeleteEntity(entityHandle)
        table.remove(Client.spawnedEntities, foundIndex)

        SendNUIMessage({
            action = 'setEntities',
            data = Client.spawnedEntities
        })

        --[[ Sending empty object to hidden editor ]]
        SendNUIMessage({
            action = 'setGizmoEntity',
            data = { object = nil }
        })
        Client.gizmoEntity = nil

        lib.notify({
            title = 'Dolu Mapping Tool',
            description = "Entity succefully deleted",
            type = 'success',
            position = 'top'
        })
    end

    cb(1)
end)