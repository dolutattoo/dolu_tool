CreateThread(function()
    Wait(500)
    GetInteriorData()
end)

-- Send interior data to NUI
CreateThread(function()
    while true do
        if Client.isMenuOpen then
            if Client.interiorId > 0 then
                GetInteriorData(true)
            else
                GetInteriorData()
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
                local ix, iy, iz = GetInteriorPosition(Client.interiorId)
                local rotX, rotY, rotZ, rotW = GetInteriorRotation(Client.interiorId)
                local interiorPosition = vec3(ix, iy, iz)
                local interiorRotation = quat(rotW, rotX, rotY, rotZ)
                local pedCoords = GetEntityCoords(cache.ped)

                for portalId = 0, GetInteriorPortalCount(Client.interiorId) - 1 do
                    local corners = {}
                    local pureCorners = {}

                    for cornerIndex = 0, 3 do
                        local cornerX, cornerY, cornerZ = GetInteriorPortalCornerPosition(Client.interiorId, portalId, cornerIndex)
                        local cornerPosition = interiorPosition + Utils.QMultiply(interiorRotation, vec3(cornerX, cornerY, cornerZ))

                        corners[cornerIndex] = cornerPosition
                        pureCorners[cornerIndex] = vec3(cornerX, cornerY, cornerZ)
                    end

                    local CrossVector = Utils.Lerp(corners[0], corners[2], 0.5)

                    if #(pedCoords - CrossVector) <= 8.0 then
                        if Client.portalPoly then
                            DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z, corners[2].x, corners[2].y, corners[2].z, 0, 0, 180, 150)
                            DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[2].x, corners[2].y, corners[2].z, corners[3].x, corners[3].y, corners[3].z, 0, 0, 180, 150)
                            DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[2].x, corners[2].y, corners[2].z, corners[1].x, corners[1].y, corners[1].z, 0, 0, 180, 150)
                            DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[1].x, corners[1].y, corners[1].z, corners[0].x, corners[0].y, corners[0].z, 0, 0, 180, 150)
                        end

                        if Client.portalLines then
                            -- Borders oultine
                            DrawLine(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z, 0, 255, 0, 255)
                            DrawLine(corners[1].x, corners[1].y, corners[1].z, corners[2].x, corners[2].y, corners[2].z, 0, 255, 0, 255)
                            DrawLine(corners[2].x, corners[2].y, corners[2].z, corners[3].x, corners[3].y, corners[3].z, 0, 255, 0, 255)
                            DrawLine(corners[3].x, corners[3].y, corners[3].z, corners[0].x, corners[0].y, corners[0].z, 0, 255, 0, 255)

                            -- Middle lines
                            DrawLine(corners[0].x, corners[0].y, corners[0].z, corners[2].x, corners[2].y, corners[2].z, 0, 255, 0, 255)
                            DrawLine(corners[1].x, corners[1].y, corners[1].z, corners[3].x, corners[3].y, corners[3].z, 0, 255, 0, 255)
                        end

                        if Client.portalCorners then
                            Utils.Draw3DText(corners[0], ('~b~C0:~w~ %s %s %s'):format(math.round(pureCorners[0].x, 2), math.round(pureCorners[0].y, 2), math.round(pureCorners[0].z, 2)))
                            Utils.Draw3DText(corners[1], ('~b~C1:~w~ %s %s %s'):format(math.round(pureCorners[1].x, 2), math.round(pureCorners[1].y, 2), math.round(pureCorners[1].z, 2)))
                            Utils.Draw3DText(corners[2], ('~b~C2:~w~ %s %s %s'):format(math.round(pureCorners[2].x, 2), math.round(pureCorners[2].y, 2), math.round(pureCorners[2].z, 2)))
                            Utils.Draw3DText(corners[3], ('~b~C3:~w~ %s %s %s'):format(math.round(pureCorners[3].x, 2), math.round(pureCorners[3].y, 2), math.round(pureCorners[3].z, 2)))
                        end

                        if Client.portalInfos then
                            local portalFlags = GetInteriorPortalFlag(Client.interiorId, portalId)
                            local portalRoomTo = GetInteriorPortalRoomTo(Client.interiorId, portalId)
                            local portalRoomFrom = GetInteriorPortalRoomFrom(Client.interiorId, portalId)

                            Utils.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z + 0.2), ('~b~Portal ~w~%s'):format(portalId))
                            Utils.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z + 0.05), ('~b~From ~w~%s~b~ To ~w~%s'):format(portalRoomFrom, portalRoomTo))
                            Utils.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z - 0.1), ('~b~Flags ~w~%s'):format(portalFlags))
                        end
                    end
                end
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
    local oldHeading = 0

    while true do
        if Client.isMenuOpen and Client.currentTab == 'home' then
            local coords = GetEntityCoords(cache.ped)
            local heading = GetEntityHeading(cache.ped)

            if #(coords - oldCoords) > 0.25 or heading - oldHeading > 1 then
                SendNUIMessage({
                    action = 'playerCoords',
                    data = {
                        coords = ('%.3f, %.3f, %.3f'):format(Utils.round(coords.x, 3), Utils.round(coords.y, 3), Utils.round(coords.z, 3)),
                        heading = tostring(Utils.round(GetEntityHeading(cache.ped), 3))
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
    SetEntityDrawOutlineColor(130, 150, 250, 180)

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


            if GetEntityType(Client.gizmoEntity) ~= 1 then
                Client.outlinedEntity = Client.gizmoEntity
                SetEntityDrawOutline(Client.outlinedEntity, true)
            end
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
            local hour, minute, second = Utils.getClock()
            Utils.setClock(hour, minute, second)
        end

        if Client.freezeWeather then
            local currentWeather = Utils.getWeather()
            Utils.setWeather(currentWeather)
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