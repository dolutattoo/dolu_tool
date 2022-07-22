-- Check for interior data
local lastRoomId = 0
function startInteriorLoop()
	CreateThread(function()
		while true do
			local playerPed = PlayerPedId()
			local interiorId = GetInteriorFromEntity(playerPed)
			local currentRoomHash = GetRoomKeyFromEntity(playerPed)
			local currentRoomId = GetInteriorRoomIndexByHash(interiorId, currentRoomHash)

			if lastRoomId ~= currentRoomId then
				lastRoomId = currentRoomId
				local roomCount = GetInteriorRoomCount(interiorId)-1
				local portalCount = GetInteriorPortalCount(interiorId)

				local rooms = {}
				for i=1, roomCount do
					rooms[i] = {
						roomId = i,
						name = GetInteriorRoomName(interiorId, i),
						flag = GetInteriorRoomFlag(interiorId, i),
						timecycle = tostring(GetInteriorRoomTimecycle(interiorId, i)),
						isCurrent = currentRoomId == i and true or nil
					}
				end

				local portals = {}
				for i=0, portalCount-1 do
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
						currentRoomId = currentRoomId > 0 and currentRoomId or 0,
						currentRoomName = currentRoomId > 0 and rooms[currentRoomId].name or 'none',
						currentRoomFlag = currentRoomId > 0 and rooms[currentRoomId].flag or 0,
						currentRoomTimecycle = currentRoomId > 0 and rooms[currentRoomId].timecycle or 0
					},
					currentRoomName = currentRoomId > 0 and rooms[currentRoomId].name or 'none'
				}

				SendReactMessage('setIntData', intData)
			else
				if interiorId == 0 then
					SendReactMessage('setIntData', {})
				end
				Wait(500)
			end
			Wait(0)
		end
	end)
end
