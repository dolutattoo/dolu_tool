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

-- Draw interior portals
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

-- Gizmo's entity
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

-- Freezing time/weather
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

-- Draw static emitters
CreateThread(function()
    while true do
        if Client.drawStaticEmitters  then
            local coords = GetEntityCoords(cache.ped)
            for _, v in ipairs(Client.data.staticEmitters) do
                if #(v.coords - coords) < Client.staticEmitterDrawDistance then
                    DrawMarker(28, v.coords.x, v.coords.y, v.coords.z, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 0, 0, 255, 255, 0, 0, 0, 0)
                end
            end
        else
            Wait(500)
        end
        Wait(0)
    end
end)