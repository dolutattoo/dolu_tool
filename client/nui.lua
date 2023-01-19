RegisterNUICallback('dolu_tool:tabSelected', function(newTab, cb)
    cb(1)
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

    elseif newTab == 'interior' and not Client.timecyclesLoaded then
        SendNUIMessage({
            action = 'setTimecycleList',
            data = Client.data.timecycles
        })
        Client.timecyclesLoaded = true

    elseif newTab == 'locations' and not Client.locationsLoaded then
        FUNC.loadPage('locations', 1)
        Client.locationsLoaded = true

    elseif newTab == 'peds' and not Client.pedsLoaded then
        FUNC.loadPage('peds', 1)
        Client.pedsLoaded = true

    elseif newTab == 'vehicles' and not Client.vehiclesLoaded then
        FUNC.loadPage('vehicles', 1)
        Client.vehiclesLoaded = true

    elseif newTab == 'weapons' and not Client.weaponsLoaded then
        FUNC.loadPage('weapons', 1)
        Client.weaponsLoaded = true
    end
end)

RegisterNUICallback('dolu_tool:teleport', function(data, cb)
    cb(1)
    if data then
        FUNC.teleportPlayer({ x = data.x, y = data.y, z = data.z, heading = data.heading }, true)

        SendNUIMessage({
            action = 'setLastLocation',
            data = data
        })

        SetResourceKvp('dolu_tool:lastLocation', json.encode(data))
        Client.lastLocation = data
    end
end)

RegisterNUICallback('dolu_tool:changePed', function(data, cb)
    cb(1)
    FUNC.changePed(data.name)
end)

RegisterNUICallback('dolu_tool:spawnVehicle', function(data, cb)
    cb(1)
    FUNC.spawnVehicle(data)
end)

RegisterNUICallback('dolu_tool:deleteVehicle', function(_, cb)
    cb(1)
    if cache.vehicle and DoesEntityExist(cache.vehicle) then
        DeleteVehicle(cache.vehicle)
    end
end)

RegisterNUICallback('dolu_tool:exit', function(_, cb)
    cb(1)
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    Client.isMenuOpen = false

    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {}
    })
    Client.gizmoEntity = nil
end)

RegisterNUICallback('dolu_tool:changeLocationName', function(data, cb)
    cb(1)
    lib.callback('dolu_tool:renameLocation', false, function(result)
        if not result then return end

        Client.data.locations[result.index] = result.data

        if Client.isMenuOpen and Client.currentTab == 'locations' then
            FUNC.loadPage('locations', 1)
        end
    end, data)
end)

RegisterNUICallback('dolu_tool:createCustomLocation', function(locationName, cb)
    cb(1)
    local playerPed = cache.ped

    lib.callback('dolu_tool:createCustomLocation', false, function(result)
        if not result then return end

        -- Insert new location at index 1
        table.insert(Client.data.locations, 1, result)

        if Client.isMenuOpen and Client.currentTab == 'locations' then
            FUNC.loadPage('locations', 1)
        end

        lib.notify({
            title = 'Dolu Tool',
            description = locale('custom_location_created'),
            type = 'success',
            position = 'top'
        })
    end, {
        name = locationName,
        coords = GetEntityCoords(playerPed),
        heading = GetEntityHeading(playerPed)
    })
end)

RegisterNUICallback('dolu_tool:deleteLocation', function(locationName, cb)
    cb(1)
    local result = lib.callback.await('dolu_tool:deleteLocation', false, locationName)
    if not result then return end

    -- Remove location from file
    table.remove(Client.data.locations, result)

    if Client.isMenuOpen and Client.currentTab == 'locations' then
        FUNC.loadPage('locations', 1)
    end
end)

RegisterNUICallback('dolu_tool:setWeather', function(weatherName, cb)
    cb(1)
    FUNC.setWeather(weatherName)
end)

RegisterNUICallback('dolu_tool:setClock', function(clock, cb)
    cb(1)
    FUNC.setClock(clock.hour, clock.minute)
end)

RegisterNUICallback('dolu_tool:getClock', function(_, cb)
    cb(1)
    local hour, minute = FUNC.getClock()
    SendNUIMessage({
        action = 'setClockData',
        data = {hour = hour, minute = minute }
    })
end)

RegisterNUICallback('dolu_tool:freezeTime', function(state, cb)
    cb(1)
    Client.freezeTime = state
end)

RegisterNUICallback('dolu_tool:freezeWeather', function(state, cb)
    cb(1)
    Client.freezeWeather = state
end)

RegisterNUICallback('dolu_tool:cleanZone', function(_, cb)
    cb(1)
    local playerId = cache.ped
    local playerCoords = GetEntityCoords(playerId)
    ClearAreaOfEverything(playerCoords.x, playerCoords.y, playerCoords.z, 1000.0, false, false, false, false)
end)

RegisterNUICallback('dolu_tool:cleanPed', function(_, cb)
    cb(1)
    local playerId = cache.ped
    ClearPedBloodDamage(playerId)
    ClearPedEnvDirt(playerId)
    ClearPedWetness(playerId)
end)

RegisterNUICallback('dolu_tool:upgradeVehicle', function(_, cb)
    cb(1)
    local vehicle = cache.vehicle
    if DoesEntityExist(vehicle) and IsEntityAVehicle(vehicle) then
        local max
        for _, modType in ipairs({11, 12, 13, 16}) do
            max = GetNumVehicleMods(vehicle, modType) - 1
            SetVehicleMod(vehicle, modType, max, customWheels)
        end
        ToggleVehicleMod(vehicle, 18, true) -- Turbo
        lib.notify({
            title = 'Dolu Tool',
            description = locale('vehicle_upgraded'),
            type = 'success',
            position = 'top'
        })
    end
end)

RegisterNUICallback('dolu_tool:repairVehicle', function(_, cb)
    cb(1)
    local vehicle = cache.vehicle
	SetVehicleFixed(vehicle)
    SetVehicleEngineHealth(vehicle, 1000.0)
    SetVehicleDirtLevel(vehicle, 0.0)
end)

RegisterNUICallback('dolu_tool:giveWeapon', function(weaponName, cb)
    cb(1)
    if Shared.ox_inventory then
        lib.callback('dolu_tool:giveWeaponToPlayer', false, function(result)
            if result then
                lib.notify({type = 'success', description = locale('weapon_gave')})
            else
                lib.notify({type = 'error', description = locale('weapon_cant_carry')})
            end
        end, weaponName)
        return
    else
        GiveWeaponToPed(cache.ped, joaat(weaponName), 999, false, true)
    end
end)

RegisterNUICallback('dolu_tool:setDay', function(_, cb)
    cb(1)
    FUNC.setClock(12)
    FUNC.setWeather('extrasunny')
end)

RegisterNUICallback('dolu_tool:setMaxHealth', function(_, cb)
    cb(1)
    local playerPed = PlayerPedId()
    SetEntityHealth(playerPed, GetEntityMaxHealth(playerPed))

    lib.notify({
        title = 'Dolu Tool',
        description = locale('max_health_set'),
        type = 'success',
        position = 'top'
    })
end)

RegisterNUICallback('dolu_tool:spawnFavoriteVehicle', function(_, cb)
    cb(1)
    FUNC.spawnVehicle('krieger')
end)

RegisterNUICallback('dolu_tool:addEntity', function(modelName, cb)
    cb(1)
    local model = joaat(modelName)
    if not IsModelInCdimage(model) then
        lib.notify({
            title = 'Dolu Tool',
            description = locale('entity_doesnt_exist'),
            type = 'error',
            position = 'top'
        })
        return
    end

    
    lib.requestModel(model)

    local distance = 5 -- Distance to spawn object from the camera
    local cameraRotation = GetFinalRenderedCamRot()
    local cameraCoord = GetFinalRenderedCamCoord()
	local direction = FUNC.rotationToDirection(cameraRotation)
	local coords =  vec3(cameraCoord.x + direction.x * distance, cameraCoord.y + direction.y * distance, cameraCoord.z + direction.z * distance)
    local obj = CreateObject(model, coords.x, coords.y, coords.z)
    
    Wait(50)
    if not DoesEntityExist(obj) then 
        lib.notify({
            title = 'Dolu Tool',
            description = locale('entity_cant_be_loaded'),
            type = 'error',
            position = 'top'
        })
        return
    end

    FreezeEntityPosition(obj, true)

    local entityRotation = GetEntityRotation(obj)

    table.insert(Client.spawnedEntities, {
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
        },
        invalid = false
    })

    SendNUIMessage({
        action = 'setObjectList',
        data = {
            entitiesList = Client.spawnedEntities,
            newIndex = #Client.spawnedEntities - 1
        }
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
end)

RegisterNUICallback('dolu_tool:setEntityModel', function(data, cb)
    cb(1)
    local model = joaat(data.modelName)
    if not IsModelInCdimage(model) then
        data.entity.invalid = true
        SendNUIMessage({
            action = 'setObjectData',
            data = {
                index = data.index,
                entity = data.entity
            }
        })
        return
    end

    -- Check if entity was spawned using Object Spawner
    local index, entity
    for k, v in ipairs(Client.spawnedEntities) do
        if v.handle == data.entity.handle then
            index = k-1
            entity = v
            break
        end
    end
    
    -- If entity was spawned using Object Spawner, send updated data to nui
    if index and entity and DoesEntityExist(entity.handle) then
        entity.invalid = false
        entity.name = data.modelName
        
        -- Remove current entity
        SetEntityAsMissionEntity(entity.handle)
        DeleteEntity(entity.handle)
        
        -- Create new entity
        lib.requestModel(model)
        local obj = CreateObject(model, entity.position.x, entity.position.y, entity.position.z)
        Wait(5)
        SetEntityRotation(obj, entity.rotation.x, entity.rotation.y, entity.rotation.z)
        
        SetModelAsNoLongerNeeded(model)
        entity.handle = obj

        SendNUIMessage({
            action = 'setObjectData',
            data = {
                index = index,
                entity = entity
            }
        })

        SendNUIMessage({
            action = 'setGizmoEntity',
            data = entity
        })
        Client.gizmoEntity = entity.handle
    end
end)

RegisterNUICallback('dolu_tool:deleteEntity', function(entityHandle, cb)
    cb(1)
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
            title = 'Dolu Tool',
            description = locale('entity_doesnt_exist'),
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
    local newIndex = foundIndex-2
    SendNUIMessage({
        action = 'setObjectList',
        data = {
            entitiesList = Client.spawnedEntities,
            newIndex = newIndex > 0 and newIndex or nil
        }
    })

    lib.notify({
        title = 'Dolu Tool',
        description = locale('entity_deleted'),
        type = 'success',
        position = 'top'
    })
end)

RegisterNUICallback('dolu_tool:deleteAllEntities', function(_, cb)
    cb(1)
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
        data = {
            entitiesList = Client.spawnedEntities,
            newIndex = nil
        }
    })
end)

RegisterNUICallback('dolu_tool:setGizmoEntity', function(entityHandle, cb)
    cb(1)
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
            title = 'Dolu Tool',
            description = locale('entity_doesnt_exist'),
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
end)

RegisterNUICallback('dolu_tool:goToEntity', function(data, cb)
    cb(1)
    if data?.position and data.handle and DoesEntityExist(data.handle) then
        local coords = GetEntityCoords(data.handle)
        FUNC.teleportPlayer({x = coords.x, y = coords.y, z = coords.z}, true)
        
        lib.notify({
            title = 'Dolu Tool',
            description = locale('teleport_success'),
            type = 'success',
            position = 'top'
        })
    else
        lib.notify({
            title = 'Dolu Tool',
            description = locale('entity_doesnt_exist'),
            type = 'error',
            position = 'top'
        })
    end
end)

RegisterNUICallback('dolu_tool:moveEntity', function(data, cb)
    cb(1)
    if data.handle then
        if DoesEntityExist(data.handle) then
            SetEntityCoords(data.handle, data.position.x, data.position.y, data.position.z)
            SetEntityRotation(data.handle, data.rotation.x, data.rotation.y, data.rotation.z)
        else
            lib.notify({
                title = 'Dolu Tool',
                description = locale('entity_doesnt_exist'),
                type = 'error',
                position = 'top'
            })
            return
        end

        -- Check if entity was spawned using Object Spawner
        local index, entity
        for k, v in ipairs(Client.spawnedEntities) do
            if v.handle == data.handle then
                index = k-1
                entity = v
                break
            end
        end

        -- If entity was spawned using Object Spawner, send updated data to nui
        if index and entity then
            local newPos = GetEntityCoords(entity.handle)
            local newRot = GetEntityRotation(entity.handle)
            entity.position = { x = newPos.x, y = newPos.y, z = newPos.z }
            entity.rotation = { x = newRot.x, y = newRot.y, z = newRot.z }

            SendNUIMessage({
                action = 'setObjectData',
                data = {
                    index = index,
                    entity = entity
                }
            })
        end
    end
end)

RegisterNUICallback('dolu_tool:snapEntityToGround', function(data, cb)
    cb(1)
    if not DoesEntityExist(data.handle) then
        lib.notify({
            title = 'Dolu Tool',
            description = locale('entity_doesnt_exist'),
            type = 'error',
            position = 'top'
        })
        return
    end

    -- Check if entity was spawned using Object Spawner
    local index, entity
    for k, v in ipairs(Client.spawnedEntities) do
        if v.handle == data.handle then
            index = k-1
            entity = v
            break
        end
    end

    -- If entity was spawned using Object Spawner, send updated data to nui
    if index and entity and DoesEntityExist(entity.handle) then
        PlaceObjectOnGroundProperly(entity.handle)

        local newPos = GetEntityCoords(entity.handle)
        local newRot = GetEntityRotation(entity.handle)
        entity.position = { x = newPos.x, y = newPos.y, z = newPos.z }
        entity.rotation = { x = newRot.x, y = newRot.y, z = newRot.z }

        SendNUIMessage({
            action = 'setObjectData',
            data = {
                index = index,
                entity = entity
            }
        })

        SendNUIMessage({
            action = 'setGizmoEntity',
            data = entity
        })
        Client.gizmoEntity = entity.handle
    end
end)

RegisterNUICallback('dolu_tool:setCustomCoords', function(data, cb)
    cb(1)
    local formatedCoords
    if data.coordString then
        local coordString = (data.coordString:gsub(',', '')):gsub('  ', ' ')

        local coords = {}
        for match in (coordString..' '):gmatch('(.-) ') do
            table.insert(coords, match)
        end
        formatedCoords = vec3(tonumber(coords[1]), tonumber(coords[2]), tonumber(coords[3]))

    elseif data.coords then
        formatedCoords = vec3(data.coords.x, data.coords.y, data.coords.z)
    end

    if not formatedCoords then return end
    FUNC.teleportPlayer({ x = formatedCoords.x, y = formatedCoords.y, z = formatedCoords.z }, true)
end)

RegisterNUICallback('dolu_tool:loadPages', function(data, cb)
    cb(1)
    FUNC.loadPage(data.type, data.activePage, data.filter, data.checkboxes)
end)

RegisterNUICallback('dolu_tool:openBrowser', function(data, cb)
    cb(1)
    SendNUIMessage({ name = 'openBrowser', url = data.url })
end)