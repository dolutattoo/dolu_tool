CreateThread(function()
    Wait(500)
    GetInteriorData(Client.interiorId)
end)

-- Send interior data to NUI
CreateThread(function()
    while true do
        if Client.isMenuOpen then
            if Client.interiorId > 0 then
                GetInteriorData(Client.interiorId, true)
            else
                GetInteriorData(Client.interiorId)
                Wait(200)
            end
        else
            Wait(500)
        end
        Wait(0)
    end
end)

CreateThread(function()
    while true do
        if Client.interiorId > 0 then
            if Client.portalPoly or Client.portalLines or Client.portalCorners or Client.portalInfos then
                DrawPortalInfos(Client.interiorId)
            end
        else
            Wait(500)
        end
        Wait(0)
    end
end)

-- Send current coords to NUI
CreateThread(function()
    local oldCoords = vec3(0, 0, 0)

    while true do
        if Client.isMenuOpen and Client.currentTab == 'home' then
            local coords = GetEntityCoords(cache.ped)

            if #(coords - oldCoords) > 0.5 then
                SendNUIMessage({
                    action = 'playerCoords',
                    data = {
                        coords = FUNC.round(coords.x, 3) .. ', ' .. FUNC.round(coords.y, 3) .. ', ' .. FUNC.round(coords.z, 3),
                        heading = tostring(FUNC.round(GetEntityHeading(cache.ped), 3))
                    }
                })
                oldCoords = coords
            end
        else
            Wait(500)
        end
        Wait(50)
    end
end)

CreateThread(function()
    SetEntityDrawOutlineShader(1)
    SetEntityDrawOutlineColor(200, 200, 250, 180)

    while true do
        if Client.gizmoEntity then
            SendNUIMessage({
                action = 'setCameraPosition',
                data = {
                    position = GetFinalRenderedCamCoord(),
                    rotation = GetFinalRenderedCamRot()
                }
            })
            if Client.outlinedEntity then
                SetEntityDrawOutline(Client.outlinedEntity, false)
            end
            Client.outlinedEntity = Client.gizmoEntity
            SetEntityDrawOutline(Client.outlinedEntity, true)

        else
            if Client.outlinedEntity then
                SetEntityDrawOutline(Client.outlinedEntity, false)
                Client.outlinedEntity = nil
            end
            Wait(250)
        end
        Wait(0)
    end
end)

CreateThread(function()
    while true do
        if Client.freezeTime then
            local hour, minute, second = FUNC.getClock()
            FUNC.setClock(hour, minute, second)
        end

        if Client.freezeWeather then
            local currentWeather = FUNC.getWeather()
            FUNC.setWeather(currentWeather)
        end

        if not Client.freezeTime and not Client.freezeWeather then
            Wait(500)
        end
        Wait(0)
    end
end)

-- Forcing stancers cause driving reset those
CreateThread(function()
    while true do
        local vehicle = cache.vehicle

        if vehicle and DoesEntityExist(vehicle) then
            if Client.stancer.wheelOffsetFront then
                SetVehicleWheelXOffset(vehicle, 0, Client.stancer.wheelOffsetFront*-1)
                SetVehicleWheelXOffset(vehicle, 1, Client.stancer.wheelOffsetFront)
            end

            if Client.stancer.wheelOffsetRear then
                SetVehicleWheelXOffset(vehicle, 2, Client.stancer.wheelOffsetRear*-1)
                SetVehicleWheelXOffset(vehicle, 3, Client.stancer.wheelOffsetRear)
            end

            if Client.stancer.wheelCamberFront then
                SetVehicleWheelYRotation(vehicle, 0, Client.stancer.wheelCamberFront*-1)
                SetVehicleWheelYRotation(vehicle, 1, Client.stancer.wheelCamberFront)
            end

            if Client.stancer.wheelCamberRear then
                SetVehicleWheelYRotation(vehicle, 2, Client.stancer.wheelCamberRear*-1)
                SetVehicleWheelYRotation(vehicle, 3, Client.stancer.wheelCamberRear)
            end
        else
            Wait(500)
        end
        Wait(0)
    end
end)

-- Enter/exit vehicle handler
--TODO: MAKE IT BETTER
local isInVehicle = false
CreateThread(function()
    while true do
        local vehicle = cache.vehicle
        if isInVehicle and not vehicle then
            -- Exited vehicle
            if Client.isMenuOpen and Client.currentTab == 'stancer' then
                SendNUIMessage({
                    action = 'setStancerTab',
                    data = {}
                })
                Client.stancerTab = nil
            end
            if Client.stancer then
                Client.stancer = {}
            end
            isInVehicle = false
        elseif not isInVehicle and vehicle then
            -- Entered vehicle
            if not Client.stancerTab then
                FUNC.setStancer()
            end
            isInVehicle = true
        end
        Wait(0)
    end
end)