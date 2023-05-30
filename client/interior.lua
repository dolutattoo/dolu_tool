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
                    list = Utils.listFlags(totalFlags, 'room'),
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
                    list = Utils.listFlags(totalFlags, 'portal'),
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
    local state = {}

    for _, v in pairs(data) do
        state[v] = true
    end

    Client.portalInfos = state.portalInfos
    Client.portalPoly = state.portalPoly
    Client.portalLines = state.portalLines
    Client.portalCorners = state.portalCorners

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

RegisterNUICallback('dolu_tool:setTimecycle', function(data, cb)
    cb(1)

    if data.roomId then
        Utils.setTimecycle(data.value)
    end
end)
