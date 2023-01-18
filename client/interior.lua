-- Check for interior data
local lastRoomId = 0
function GetInteriorData(interiorId, fromThread)
    local currentRoomHash = GetRoomKeyFromEntity(cache.ped)
    local currentRoomId = GetInteriorRoomIndexByHash(interiorId, currentRoomHash)

    if (fromThread and lastRoomId ~= currentRoomId) or not fromThread then
        lastRoomId = currentRoomId
        local roomCount = GetInteriorRoomCount(interiorId) - 1
        local portalCount = GetInteriorPortalCount(interiorId)

        local rooms = {}
        for i = 1, roomCount do
            local totalFlags = GetInteriorRoomFlag(interiorId, i)
            rooms[i] = {
                index = i,
                name = GetInteriorRoomName(interiorId, i),
                timecycle = tostring(GetInteriorRoomTimecycle(interiorId, i)),
                isCurrent = currentRoomId == i and true or nil,
                flags = {
                    list = FUNC.listFlags(totalFlags, 'room'),
                    total = totalFlags
                }
            }
        end

        local portals = {}
        for i = 0, portalCount - 1 do
            local totalFlags = GetInteriorPortalFlag(interiorId, i)
            portals[i] = {
                index = i,
                roomFrom = GetInteriorPortalRoomFrom(interiorId, i),
                roomTo = GetInteriorPortalRoomTo(interiorId, i),
                flags = {
                    list = FUNC.listFlags(totalFlags, 'portal'),
                    total = totalFlags
                }
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
                timecycle = currentRoomId > 0 and rooms[currentRoomId].timecycle or 0,
                flags = currentRoomId > 0 and rooms[currentRoomId].flags or {list = {}, total = 0},
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

-- Portals display
RegisterNUICallback('dolu_tool:setPortalCheckbox', function(data, cb)
    local tmp = {}
    for _, v in pairs(data) do tmp[v] = true end
    if tmp.portalInfos then Client.portalInfos = true else Client.portalInfos = false end
    if tmp.portalPoly then Client.portalPoly = true else Client.portalPoly = false end
    if tmp.portalLines then Client.portalLines = true else Client.portalLines = false end
    if tmp.portalCorners then Client.portalCorners = true else Client.portalCorners = false end
    cb(1)
end)

RegisterNUICallback('dolu_tool:setPortalFlagCheckbox', function(data, cb)
    local flag = 0
    for _, v in ipairs(data.flags) do
        flag += tonumber(v)
    end

    SetInteriorPortalFlag(Client.interiorId, data.portalIndex, flag)
    Wait(10)
    RefreshInterior(Client.interiorId)

    -- Update flag back in nui
    GetInteriorData(Client.interiorId)

    cb(1)
end)

function DrawPortalInfos(interiorId)
    local ix, iy, iz = GetInteriorPosition(interiorId)
    local rotX, rotY, rotZ, rotW = GetInteriorRotation(interiorId)
    local interiorPosition = vec3(ix, iy, iz)
    local interiorRotation = quat(rotW, rotX, rotY, rotZ)
    local pedCoords = GetEntityCoords(cache.ped)

    for portalId = 0, GetInteriorPortalCount(interiorId) - 1 do
        local corners = {}
        local pureCorners = {}

        for cornerIndex = 0, 3 do
            local cornerX, cornerY, cornerZ = GetInteriorPortalCornerPosition(interiorId, portalId, cornerIndex)
            local cornerPosition = interiorPosition + FUNC.QMultiply(interiorRotation, vec3(cornerX, cornerY, cornerZ))
            corners[cornerIndex] = cornerPosition
            pureCorners[cornerIndex] = vec3(cornerX, cornerY, cornerZ)
        end
        local CrossVector = FUNC.Lerp(corners[0], corners[2], 0.5)
        
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
                FUNC.Draw3DText(corners[0], '~b~C0:~w~ ' .. math.round(pureCorners[0].x, 2) .. ' ' .. math.round(pureCorners[0].y, 2) .. ' ' .. math.round(pureCorners[0].z, 2))
                FUNC.Draw3DText(corners[1], '~b~C1:~w~ ' .. math.round(pureCorners[1].x, 2) .. ' ' .. math.round(pureCorners[1].y, 2) .. ' ' .. math.round(pureCorners[1].z, 2))
                FUNC.Draw3DText(corners[2], '~b~C2:~w~ ' .. math.round(pureCorners[2].x, 2) .. ' ' .. math.round(pureCorners[2].y, 2) .. ' ' .. math.round(pureCorners[2].z, 2))
                FUNC.Draw3DText(corners[3], '~b~C3:~w~ ' .. math.round(pureCorners[3].x, 2) .. ' ' .. math.round(pureCorners[3].y, 2) .. ' ' .. math.round(pureCorners[3].z, 2))
            end

            if Client.portalInfos then
                local portalFlags = GetInteriorPortalFlag(interiorId, portalId)
                local portalRoomTo = GetInteriorPortalRoomTo(interiorId, portalId)
                local portalRoomFrom = GetInteriorPortalRoomFrom(interiorId, portalId)
                FUNC.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z + 0.2), '~b~Portal ~w~' .. portalId)
                FUNC.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z + 0.05), '~b~From ~w~' .. portalRoomFrom .. '~b~ To ~w~' .. portalRoomTo)
                FUNC.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z - 0.1), '~b~Flags ~w~' .. portalFlags)
            end
        end
    end
end

RegisterNUICallback('dolu_tool:setTimecycle', function(data, cb)
    if data.roomId then
        FUNC.setTimecycle(data.value)
    end
    cb(1)
end)

-- Temporary development stuff
local autotime = false
RegisterCommand('autotime', function(source, args)
    autotime = not autotime
end, false)

CreateThread(function()
    local h = 0
    while true do
        if autotime then
            h += 1
            if h > 22 then h = 0 end
            FUNC.setClock(h, 0, 0)
        end
        Wait(75)
    end
end)