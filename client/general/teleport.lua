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

-- Teleport List

RegisterNetEvent('dmt:teleport:initPositions', function(positionsData)
	local initPositions = {}
	for k, v in pairs(positionsData) do
		table.insert(initPositions, {value = (v.name):gsub('%s+', '_'), label = v.name})
	end
	Wait(100)
	SendReactMessage('dmt:teleport:setPositionData', initPositions)
end)

RegisterNUICallback('dmt:teleport:tpList', function(data, cb)
  for k, v in pairs(positionsData) do
    if (v.name):gsub("%s+", "_") == data then
      coords = v.coords
      break
    end
  end
  local playerPed = PlayerPedId()
  SetPedCoordsKeepVehicle(playerPed, coords.x + 0.0, coords.y + 0.0, coords.z + 0.0)
	cb({})
end)

RegisterNUICallback('dmt:teleport:removeList', function(data, cb)
	for k, v in pairs(positionsData) do
		if (v.name):gsub("%s+", "_") == data then
			deletePosition = k
			break
		end
	end
	table.remove(positionsData, deletePosition)
	FUNC.savePositions(positionsData)
	cb({})
end)

RegisterNUICallback('dmt:teleport:savePosition', function(data, cb)
	local playerPed = PlayerPedId()
	local coords = GetEntityCoords(playerPed)
	table.insert(positionsData, {name = data, coords = {x = coords.x, y = coords.y, z = coords.z}})
	FUNC.savePositions(positionsData)
	cb({})
end)
