RegisterNUICallback('dmt:teleport:tpMarker', function(data, cb)
	FUNC.teleportToMarker()
	cb({})
end)

RegisterNUICallback('dmt:teleport:tpCoords', function(data, cb)
	if not data then print('[^1ERROR^7] Error while trying to teleport to coords') cb({}) return end
	coords = FUNC.stringSplit(data, ', ')
	if not coords or #coords ~= 3 then print('[^1WARNING^7] Invalid coordinates') cb({}) return end
	coords = vec3(tonumber(coords[1]), tonumber(coords[2]), tonumber(coords[3]))

	FUNC.teleportToCoords(coords)
	cb({})
end)

RegisterNUICallback('dmt:teleport:getCoords', function(data, cb)
	local playerPed = PlayerPedId()
	local coords = GetEntityCoords(playerPed)

	cb({ coords = FUNC.round(coords.x, 3) .. ', ' .. FUNC.round(coords.y, 3) .. ', ' .. FUNC.round(coords.z, 3) })
end)

RegisterNUICallback('dmt:teleport:tpList', function(data, cb)
	cb({})
end)

RegisterNUICallback('dmt:teleport:savePosition', function(data, cb)
	cb({})
end)