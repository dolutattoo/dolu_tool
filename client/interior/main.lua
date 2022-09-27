-- Check for interior data
local lastRoomId = 0
function GetInteriorData(fromThread)
    local playerPed = PlayerPedId()
    local interiorId = GetInteriorFromEntity(playerPed)
    local currentRoomHash = GetRoomKeyFromEntity(playerPed)
    local currentRoomId = GetInteriorRoomIndexByHash(interiorId, currentRoomHash)

    if (fromThread and lastRoomId ~= currentRoomId) or not fromThread then
        lastRoomId = currentRoomId
        local roomCount = GetInteriorRoomCount(interiorId) - 1
        local portalCount = GetInteriorPortalCount(interiorId)

        local rooms = {}
        for i = 1, roomCount do
            rooms[i] = {
                index = i,
                name = GetInteriorRoomName(interiorId, i),
                flag = GetInteriorRoomFlag(interiorId, i),
                timecycle = tostring(GetInteriorRoomTimecycle(interiorId, i)),
                isCurrent = currentRoomId == i and true or nil
            }
        end

        local portals = {}
        for i = 0, portalCount - 1 do
            portals[i] = {
                index = i,
                flag = GetInteriorPortalFlag(interiorId, i),
                roomFrom = GetInteriorPortalRoomFrom(interiorId, i),
                roomTo = GetInteriorPortalRoomTo(interiorId, i)
            }
        end

        local intData = {
            interiorId = interiorId,
            roomCount = roomCount,
            portalCount = portalCount,
            rooms = rooms,
            portals = portals,
            currentRoom = {
                index = currentRoomId > 0 and currentRoomId or 0,
                name = currentRoomId > 0 and rooms[currentRoomId].name or 'none',
                flag = currentRoomId > 0 and rooms[currentRoomId].flag or 0,
                timecycle = currentRoomId > 0 and rooms[currentRoomId].timecycle or 0
            }
        }

        SendNUIMessage({
            action = 'setIntData',
            data = intData
        })
    else
        if interiorId == 0 then
            SendNUIMessage({
                action = 'setIntData',
                data = { interiorId = 0 }
            })
        end
        Wait(500)
    end
end

CreateThread(function()
    while true do
        GetInteriorData(true)
        Wait(0)
    end
end)

-- Portals display
local portalPoly, portalLines, portalCorners, portalInfos = false, false, false, false

RegisterNUICallback('dmt:setPortalCheckbox', function(data)
    local options = {}
    for _, v in pairs(data) do options[v] = true end
    if options.portalInfos then portalInfos = true else portalInfos = false end
    if options.portalPoly then portalPoly = true else portalPoly = false end
    if options.portalLines then portalLines = true else portalLines = false end
    if options.portalCorners then portalCorners = true else portalCorners = false end
end)

CreateThread(function()
    while true do
        if portalPoly or portalLines or portalCorners or portalInfos then
            local playerPed = PlayerPedId()
            local interiorId = GetInteriorFromEntity(playerPed)
            local pedCoords = GetEntityCoords(playerPed)

            if interiorId > 0 then
                local ix, iy, iz = GetInteriorPosition(interiorId)
                local rotX, rotY, rotZ, rotW = GetInteriorRotation(interiorId)
                local YMapInteriorPos = vector3(ix, iy, iz)
                local Orientation = quat(rotW, rotX, rotY, rotZ)

                for portalId = 0, GetInteriorPortalCount(interiorId) - 1 do
                    local corners = {}
                    local pureCorners = {}
                    for c = 0, 3 do
                        local cx, cy, cz = GetInteriorPortalCornerPosition(interiorId, portalId, c)
                        local cornerPosition = YMapInteriorPos + FUNC.QMultiply(Orientation, vector3(cx, cy, cz))

                        corners[c] = cornerPosition
                        pureCorners[c] = vector3(cx, cy, cz)
                    end

                    local CrossVector = FUNC.Lerp(corners[0], corners[2], 0.5)

                    if portalPoly then
                        DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z,
                            corners[2].x, corners[2].y, corners[2].z, 255, 120, 50, 150)
                        DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[2].x, corners[2].y, corners[2].z,
                            corners[3].x, corners[3].y, corners[3].z, 255, 120, 50, 150)
                        DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[2].x, corners[2].y, corners[2].z,
                            corners[1].x, corners[1].y, corners[1].z, 255, 120, 50, 150)
                        DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[1].x, corners[1].y, corners[1].z,
                            corners[0].x, corners[0].y, corners[0].z, 255, 120, 50, 150)
                    end

                    if portalLines then
                        DrawLine(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z, 0,
                            255, 0, 255)
                        DrawLine(corners[1].x, corners[1].y, corners[1].z, corners[2].x, corners[2].y, corners[2].z, 0,
                            255, 0, 255)
                        DrawLine(corners[2].x, corners[2].y, corners[2].z, corners[3].x, corners[3].y, corners[3].z, 0,
                            255, 0, 255)
                        DrawLine(corners[3].x, corners[3].y, corners[3].z, corners[0].x, corners[0].y, corners[0].z, 0,
                            255, 0, 255)

                        DrawLine(corners[0].x, corners[0].y, corners[0].z, corners[2].x, corners[2].y, corners[2].z, 0,
                            255, 0, 255)
                        DrawLine(corners[1].x, corners[1].y, corners[1].z, corners[3].x, corners[3].y, corners[3].z, 0,
                            255, 0, 255)
                    end

                    if #(pedCoords - CrossVector) <= 8.0 and portalCorners then
                        FUNC.Draw3DText(corners[0],
                            '~o~C0:~w~ ' ..
                            math.round(pureCorners[0].x, 2) ..
                            ' ' .. math.round(pureCorners[0].y, 2) .. ' ' .. math.round(pureCorners[0].z, 2))
                        FUNC.Draw3DText(corners[1],
                            '~o~C1:~w~ ' ..
                            math.round(pureCorners[1].x, 2) ..
                            ' ' .. math.round(pureCorners[1].y, 2) .. ' ' .. math.round(pureCorners[1].z, 2))
                        FUNC.Draw3DText(corners[2],
                            '~o~C2:~w~ ' ..
                            math.round(pureCorners[2].x, 2) ..
                            ' ' .. math.round(pureCorners[2].y, 2) .. ' ' .. math.round(pureCorners[2].z, 2))
                        FUNC.Draw3DText(corners[3],
                            '~o~C3:~w~ ' ..
                            math.round(pureCorners[3].x, 2) ..
                            ' ' .. math.round(pureCorners[3].y, 2) .. ' ' .. math.round(pureCorners[3].z, 2))
                    end

                    if #(pedCoords - CrossVector) <= 8.0 and portalInfos then
                        FUNC.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z + 0.2),
                            '~o~Portal ~w~' .. portalId)
                        local portalFlags = GetInteriorPortalFlag(interiorId, portalId)
                        local portalRoomTo = GetInteriorPortalRoomTo(interiorId, portalId)
                        local portalRoomFrom = GetInteriorPortalRoomFrom(interiorId, portalId)
                        FUNC.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z + 0.05),
                            '~o~From ~w~' .. portalRoomFrom .. '~o~ To ~w~' .. portalRoomTo)
                        FUNC.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z - 0.1),
                            '~o~Flags ~w~' .. portalFlags)
                    end
                end

            end
        end
        Wait(0)
    end
end)
