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

    if newTab == 'world' then
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
end)

RegisterNUICallback('dmt:teleport', function(data, cb)
    FUNC.teleportPlayer({ x = data.x, y = data.y, z = data.z, heading = data.heading }, true)

    SendNUIMessage({
        action = 'setLastLocation',
        data = data
    })

    SetResourceKvp('dmt_lastLocation', json.encode(data))
    Client.lastLocation = data
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

RegisterNUICallback('dmt:setMaxHealth', function(_, cb)
    local playerPed = PlayerPedId()
    SetEntityHealth(playerPed, GetEntityMaxHealth(playerPed))

    lib.notify({
        title = 'Dolu Mapping Tool',
        description = "Max health succefully set.",
        type = 'success',
        position = 'top'
    })
end)

RegisterNUICallback('dmt:spawnFavoriteVehicle', function(_, cb)
    FUNC.spawnVehicle('krieger')
    cb(1)
end)

RegisterNUICallback('dmt:addEntity', function(modelName, cb)
    local model = joaat(modelName)
    FUNC.assert(IsModelInCdimage(model) == false, "Model does not exist")

    local coords = GetOffsetFromEntityInWorldCoords(cache.ped, 0, 5, 0)

    RequestModel(model)
    while not HasModelLoaded(model) do Wait(0) end

    local obj = CreateObject(model, coords.x, coords.y+2, coords.z)
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

    -- Enabling freecam
    Client.noClip = true
    SetFreecamActive(Client.noClip)

    cb(1)
end)

RegisterNUICallback('dmt:setGizmoEntity', function(entity, cb)
    -- If entity param is nil, hide gizmo
    if not entity then
        SendNUIMessage({
            action = 'setGizmoEntity',
            data = {}
        })
        Client.gizmoEntity = nil
    end

    -- If entity param is the entity handle, find it in spawnedEntities
    if type(entity) == "number" then
        local found
        for _, v in ipairs(Client.spawnedEntities) do
            if v.handle == entity then
                entity = v
                found = true
                break
            end
        end

        if not found then
            lib.notify({
                title = 'Dolu Mapping Tool',
                description = "Entity not found!",
                type = 'error',
                position = 'top'
            })
            return
        end
    end

    -- Set entity gizmo
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
            data = {}
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

RegisterNUICallback('dmt:loadYmap', function(fileName, cb)
    -- Prevent to load Ymap with same name multiple times
    if Client.loadedYmap then
        for _, v in ipairs(Client.loadedYmap) do
            if v.name == fileName then
                lib.notify({
                    title = 'Dolu Mapping Tool',
                    description = "A ymap file with the same name is already loaded.",
                    type = 'error',
                    position = 'top'
                })
                return
            end
        end
    end

    -- Get entities from xml file
    local entities = lib.callback.await('dmt:getYmapEntities', false, fileName)
    if not entities then
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = "This file does not contains any entity",
            type = 'error',
            position = 'top'
        })
        return
    end

    -- Spawning entities
    local spawnedEntities = {}
    for k, v in ipairs(entities) do
        local model = joaat(v.name)

        if IsModelInCdimage(model) then
            RequestModel(model)
            while not HasModelLoaded(model) do Wait(0) end

            local obj = CreateObjectNoOffset(model, v.position.x, v.position.y, v.position.z)
            SetEntityQuaternion(obj, v.rotation.x, v.rotation.y, v.rotation.z, v.rotation.w)

            if v.frozen then
                FreezeEntityPosition(obj, true)
            end

            local entityRotation = GetEntityRotation(obj)
            spawnedEntities[#spawnedEntities+1] = {
                name = v.name,
                handle = obj,
                position = { x = v.position.x, y = v.position.y, z = v.position.z },
                rotation = { x = entityRotation.x, y = entityRotation.y, z = entityRotation.z },
                frozen = v.frozen
            }

            SetModelAsNoLongerNeeded(model)
        else
            lib.notify({
                title = 'Dolu Mapping Tool',
                description = "Entity with name '" .. v.name .. "' (index " .. k .. ") does not exist",
                type = 'error',
                position = 'top'
            })
        end
    end

    -- If no entity spawned, stop the function
    if #spawnedEntities < 1 then
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = "No entity spawned",
            type = 'error',
            position = 'top'
        })
        return
    end

    Client.spawnedEntities = spawnedEntities

    -- Register the ymap in Client.loadedYmap
    if not Client.loadedYmap then Client.loadedYmap = {} end
    table.insert(Client.loadedYmap, {
        name     = fileName,
        entities = spawnedEntities
    })

    -- Sending Ymap properties to NUI
    SendNUIMessage({
        action = 'setYmapList',
        data = Client.loadedYmap
    })

    cb(1)
end)

RegisterNUICallback('dmt:setYmapName', function(data, cb)
    print("\nTODO - Edit ymap name.\n Old:", data.oldName, 'New:', data.newName, "\n")
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
end)
