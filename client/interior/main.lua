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
                roomId = i,
                name = GetInteriorRoomName(interiorId, i),
                flag = GetInteriorRoomFlag(interiorId, i),
                timecycle = tostring(GetInteriorRoomTimecycle(interiorId, i)),
                isCurrent = currentRoomId == i and true or nil
            }
        end

        local portals = {}
        for i = 0, portalCount - 1 do
            portals[i] = {
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
                id = currentRoomId > 0 and currentRoomId or 0,
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
