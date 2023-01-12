RegisterNUICallback('dmt:tabSelected', function(newTab, cb)
    local previousTab = Client.currentTab
    Client.currentTab = newTab

    -- If exiting object tab while gizmo is enabled, set gizmo disabled
    if previousTab == 'object' and newTab ~= 'object' then
        SendNUIMessage({
            action = 'setGizmoEntity',
            data = {}
        })
        Client.gizmoEntity = nil
    end

    if newTab == 'home' then
        FUNC.setMenuPlayerCoords()
    
    elseif newTab == 'world' then
        local hour, minute = FUNC.getClock()

        SendNUIMessage({
            action = 'setWorldData',
            data = {
                clock = { hour = hour, minute = minute },
                weather = FUNC.getWeather()
            }
        })

    elseif newTab == 'object' then
        SendNUIMessage({
            action = 'setYmapList',
            data = Client.loadedYmap
        })
    end
    
    cb(1)
end)

RegisterNUICallback('dmt:teleport', function(data, cb)
    if data then
        FUNC.teleportPlayer({ x = data.x, y = data.y, z = data.z, heading = data.heading }, true)

        SendNUIMessage({
            action = 'setLastLocation',
            data = data
        })

        SetResourceKvp('dmt_lastLocation', json.encode(data))
        Client.lastLocation = data
    end
    
    cb(1)
end)

RegisterNUICallback('dmt:changePed', function(data, cb)
    FUNC.changePed(data.name)
    
    cb(1)
end)

RegisterNUICallback('dmt:spawnVehicle', function(data, cb)
    FUNC.spawnVehicle(data)
    
    cb(1)
end)

RegisterNUICallback('dmt:deleteVehicle', function(_, cb)
    DeleteVehicle(cache.vehicle)
    
    cb(1)
end)

RegisterNUICallback('dmt:exit', function(_, cb)
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    Client.isMenuOpen = false

    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {}
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

        lib.notify({
            title = 'Dolu Mapping Tool',
            description = "Custom location succefully created!",
            type = 'success',
            position = 'top'
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

RegisterNUICallback('dmt:freezeTime', function(state, cb)
    Client.freezeTime = state
    
    cb(1)
end)

RegisterNUICallback('dmt:freezeWeather', function(state, cb)
    Client.freezeWeather = state
    
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

RegisterNUICallback('dmt:upgradeVehicle', function(_, cb)
    local vehicle = cache.vehicle
    if DoesEntityExist(vehicle) and IsEntityAVehicle(vehicle) then
        local max
        for _, modType in ipairs({11, 12, 13, 16}) do
            max = GetNumVehicleMods(vehicle, modType) - 1
            SetVehicleMod(vehicle, modType, max, customWheels)
        end
        ToggleVehicleMod(vehicle, 18, true) -- Turbo
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = "Vehicle succefully upgraded!",
            type = 'success',
            position = 'top'
        })
    end
    cb(1)
end)

RegisterNUICallback('dmt:repairVehicle', function(_, cb)
    local vehicle = cache.vehicle
	SetVehicleFixed(vehicle)
    SetVehicleEngineHealth(vehicle, 1000.0)
    SetVehicleDirtLevel(vehicle, 0.0)
    
    cb(1)
end)

RegisterNUICallback('dmt:giveWeapon', function(weaponName, cb)
    if Shared.ox_inventory then
        lib.callback('dmt:giveWeaponToPlayer', false, function(result)
            if result then
                lib.notify({type = "success", description = "You just receive a weapon"})
            else
                lib.notify({type = "error", description = "You cannot receive this weapon"})
            end
        end, weaponName)
        
        return
    else
        GiveWeaponToPed(cache.ped, joaat(weaponName), 999, false, true)
    end

    cb(1)
end)

RegisterNUICallback('dmt:setDay', function(_, cb)
    FUNC.setClock(12)
    FUNC.setWeather('extrasunny')
    
    cb(1)
end)

RegisterNUICallback('dmt:setMaxHealth', function(_, cb)
    local playerPed = PlayerPedId()
    SetEntityHealth(playerPed, GetEntityMaxHealth(playerPed))

    lib.notify({
        title = 'Dolu Mapping Tool',
        description = "Max health succefully set.",
        type = 'success',
        position = 'top'
    })
    
    cb(1)
end)

RegisterNUICallback('dmt:spawnFavoriteVehicle', function(_, cb)
    FUNC.spawnVehicle('krieger')
    
    cb(1)
end)

RegisterNUICallback('dmt:addEntity', function(modelName, cb)
    local model = joaat(modelName)
    if not IsModelInCdimage(model) then
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = "This entity does not exist in the game!",
            type = 'error',
            position = 'top'
        })
        cb(1)
        return
    end

    
    lib.requestModel(model)
    local coords = GetOffsetFromEntityInWorldCoords(cache.ped, 0, 5, 0)
    local obj = CreateObject(model, coords.x, coords.y+2, coords.z)
    
    Wait(50)
    if not DoesEntityExist(obj) then 
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = "Looks like the cannot be loaded.",
            type = 'error',
            position = 'top'
        })
        cb(1)
        return
    end

    PlaceObjectOnGroundProperly(obj)
    FreezeEntityPosition(obj, true)

    local entityRotation = GetEntityRotation(obj)

    table.insert(Client.spawnedEntities, 1, {
        handle = obj,
        name = modelName,
        position = {
            x = FUNC.round(coords.x, 3),
            y = FUNC.round(coords.y, 3),
            z = FUNC.round(coords.z, 3)
        },
        rotation = {
            x = FUNC.round(entityRotation.x, 3),
            y = FUNC.round(entityRotation.y, 3),
            z = FUNC.round(entityRotation.z, 3)
        }
    })

    SendNUIMessage({
        action = 'setObjectList',
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

RegisterNUICallback('dmt:deleteEntity', function(entityHandle, cb)
    -- Make sure entity exists in spawnedEntities
    local foundIndex
    for k, v in ipairs(Client.spawnedEntities) do
        if v.handle == entityHandle then
            foundIndex = k
            break
        end
    end

    if not foundIndex or not DoesEntityExist(entityHandle) then
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = "Entity does not exist!",
            type = 'error',
            position = 'top'
        })
        return
    end

    DeleteEntity(entityHandle)
    table.remove(Client.spawnedEntities, foundIndex)

    -- Sending empty object to hide editor
    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {}
    })
    Client.gizmoEntity = nil

    -- Updating nui object list
    SendNUIMessage({
        action = 'setObjectList',
        data = Client.spawnedEntities
    })

    lib.notify({
        title = 'Dolu Mapping Tool',
        description = "Entity succefully deleted",
        type = 'success',
        position = 'top'
    })

    cb(1)
end)

RegisterNUICallback('dmt:deleteAllEntities', function(_, cb)
    -- Sending empty object to hide editor
    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {}
    })
    Client.gizmoEntity = nil

    -- Remove all spawned entities
    for _, v in ipairs(Client.spawnedEntities) do
        if DoesEntityExist(v.handle) then
            DeleteEntity(v.handle)
        end
    end
    Client.spawnedEntities = {}

    -- Updating nui object list
    SendNUIMessage({
        action = 'setObjectList',
        data = Client.spawnedEntities
    })

    cb(1)
end)

RegisterNUICallback('dmt:setGizmoEntity', function(entityHandle, cb)
    -- If entity param is nil, hide gizmo
    if not entityHandle then
        SendNUIMessage({
            action = 'setGizmoEntity',
            data = {}
        })
        Client.gizmoEntity = nil
        return
    end

    -- Make sure entity exists in spawnedEntities
    local entity
    for _, v in ipairs(Client.spawnedEntities) do
        if v.handle == entityHandle then
            entity = v
            break
        end
    end

    if not entity or not DoesEntityExist(entityHandle) then
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = "Entity does not exist!",
            type = 'error',
            position = 'top'
        })
        return
    end

    -- Set entity gizmo
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

    cb(1)
end)

RegisterNUICallback('dmt:goToEntity', function(data, cb)
    print(json.encode(data, {indent=true}))

    if data?.position and data.handle and DoesEntityExist(data.handle) then
        local coords = GetEntityCoords(data.handle)
        FUNC.teleportPlayer({x = coords.x, y = coords.y, z = coords.z}, true)
        
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = "Succefully teleported! Use /goback to go back to last location",
            type = 'success',
            position = 'top'
        })
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
    end
    
    cb(1)
end)

RegisterNUICallback('dmt:snapEntityToGround', function(entity, cb)
    if not DoesEntityExist(entity.handle) then
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = "Entity does not exist!",
            type = 'error',
            position = 'top'
        })
        return
    end

    PlaceObjectOnGroundProperly(entity.handle)

    -- Updating gizmo
    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {
            name = entity.name,
            handle = entity.handle,
            position = GetEntityCoords(entity.handle),
            rotation = GetEntityRotation(entity.handle),
        }
    })
    
    cb(1)
end)

RegisterNUICallback('dmt:setCustomCoords', function(data, cb)
    local formatedCoords
    if data.coordString then
        local coordString = (data.coordString:gsub(',', '')):gsub('  ', ' ')

        local coords = {}
        for match in (coordString..' '):gmatch("(.-) ") do
            table.insert(coords, match)
        end
        formatedCoords = vec3(tonumber(coords[1]), tonumber(coords[2]), tonumber(coords[3]))

    elseif data.coords then
        formatedCoords = vec3(data.coords.x, data.coords.y, data.coords.z)
    end

    if not formatedCoords then return end
    FUNC.teleportPlayer({ x = formatedCoords.x, y = formatedCoords.y, z = formatedCoords.z }, true)
    
    cb(1)
end)
