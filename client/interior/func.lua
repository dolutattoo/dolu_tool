FUNC = {}
LastEntitySet = nil


FUNC.round = function(num, decimals)
	local power = 10 ^ decimals
	return math.floor(num * power) / power
end

FUNC.stringSplit = function(input, seperator)
	if seperator == nil then
		seperator = "%s"
	end

	local t, i = {}, 1

	for str in string.gmatch(input, "([^" .. seperator .. "]+)") do
		t[i] = str
		i = i + 1
	end

	return t
end

FUNC.displayKeyboard = function(title)
	if (title == nil) then
		title = ""
	end

	AddTextEntry('FMMC_KEY_TIP1', title)
	DisplayOnscreenKeyboard(1, "FMMC_KEY_TIP1", "", "", "", "", "", 30)
	while (UpdateOnscreenKeyboard() == 0) do
		DisableAllControlActions(0)
		Wait(0)
	end

	if (GetOnscreenKeyboardResult()) then
		return GetOnscreenKeyboardResult()
	end
end

FUNC.setTimecycle = function(name)
	local playerPed = PlayerPedId()
	local interiorId = GetInteriorFromEntity(playerPed)

	if interiorId ~= 0 then
		local roomHash = GetRoomKeyFromEntity(playerPed)
		local roomId = GetInteriorRoomIndexByHash(interiorId, roomHash)
		local timecycleHash = GetHashKey(name)

		SetInteriorRoomTimecycle(interiorId, roomId, timecycleHash)
		RefreshInterior(interiorId)
	else
		SetTimecycleModifier(name)
	end
end

FUNC.setPortalFlag = function(portal, flag)
	local playerPed = PlayerPedId()
	local interiorId = GetInteriorFromEntity(playerPed)

	if interiorId ~= 0 then
		local portalIndex = tonumber(portal)
		local newFlag = tonumber(flag)

		SetInteriorPortalFlag(interiorId, portalIndex, newFlag)
		RefreshInterior(interiorId)
	end
end

FUNC.setRoomFlag = function(flag)
	local playerPed = PlayerPedId()
	local interiorId = GetInteriorFromEntity(playerPed)
	local roomHash = GetRoomKeyFromEntity(playerPed)
	local roomId = GetInteriorRoomIndexByHash(interiorId, roomHash)

	if interiorId ~= 0 and roomId ~= -1 then
		local newFlag = tonumber(flag)
		SetInteriorRoomFlag(interiorId, roomId, newFlag)
		RefreshInterior(interiorId)
	end
end

FUNC.resetNoClip = function()
	local playerPed = PlayerPedId()
	ResetPedRagdollBlockingFlags(playerPed, 2)
	ResetPedRagdollBlockingFlags(playerPed, 3)
	SetEntityCollision(playerPed, true, true)
	FreezeEntityPosition(playerPed, false)
end

FUNC.enableEntitySet = function(value)
	local playerPed = PlayerPedId()
	local interiorId = GetInteriorFromEntity(playerPed)

	if IsInteriorEntitySetActive(interiorId, value) then
		DeactivateInteriorEntitySet(interiorId, value)
		print("EntitySet ^5" .. value .. " ^1disabled")
		LastEntitySet = value
	else
		ActivateInteriorEntitySet(interiorId, value)
		print("EntitySet ^5" .. value .. " ^2enabled")
		LastEntitySet = value
	end

	RefreshInterior(interiorId)
end

FUNC.toggleLastEntitySet = function()
	local playerPed = PlayerPedId()
	local interiorId = GetInteriorFromEntity(playerPed)

	if LastEntitySet ~= nil then
		if IsInteriorEntitySetActive(interiorId, LastEntitySet) then
			DeactivateInteriorEntitySet(interiorId, tostring(LastEntitySet))
			RefreshInterior(interiorId)
			print("EntitySet ^5" .. tostring(LastEntitySet) .. " ^1disabled")
		else
			ActivateInteriorEntitySet(interiorId, tostring(LastEntitySet))
			RefreshInterior(interiorId)
			print("EntitySet ^5" .. tostring(LastEntitySet) .. " ^2enabled")
		end
	else
		print("EntitySet not applied")
	end
end

FUNC.teleportToMarker = function()
	local playerPed = PlayerPedId()
	local waypointHandle = GetFirstBlipInfoId(8)

	if DoesBlipExist(waypointHandle) then

		local waypointCoords = GetBlipInfoIdCoord(waypointHandle)
		for height = 1, 1000 do
			SetPedCoordsKeepVehicle(playerPed, waypointCoords.x, waypointCoords.y, height + 0.0)

			local foundGround, _ = GetGroundZFor_3dCoord(waypointCoords.x, waypointCoords.y, height + 0.0)
			if foundGround then
				SetPedCoordsKeepVehicle(playerPed, waypointCoords.x, waypointCoords.y, height + 0.0)
				break
			end

			Wait(1)
		end

		print('Succefully teleported')
	else
		print('No waypoint placed!')
	end
end

FUNC.teleportToCoords = function(coords)
	local playerPed = PlayerPedId()
	SetPedCoordsKeepVehicle(playerPed, coords[1] + 0.0, coords[2] + 0.0, coords[3] + 0.0)
	print("[^5INFO^7] Teleported to coordinates: ^5" .. coords .. "^7")
end

---Get current clock time client side
---@return number hour, number minutes, number seconds
FUNC.getClock = function()
	return GetClockHours(), GetClockMinutes(), GetClockSeconds()
end

---Set clock time client side
---@param hour number A number between 0 and 23
---@param minutes number A number between 0 and 59
---@param seconds number A number between 0 and 59
FUNC.setClock = function(hour, minutes, seconds)
	assert(type(hour) == "number" and hour <= 23, "'hour' parameter must be a number and his maximum value must be 23")
	assert(type(minutes) == "number" and minutes <= 59, "'minutes' parameter must be a number and his maximum value must be 59")
	assert(type(seconds) == "number" and seconds <= 59, "'seconds' parameter must be a number and his maximum value must be 59")
	NetworkOverrideClockTime(hour, minutes or 0, seconds or 0)
end

---Get the current weather client side
---@return number currentWeather
FUNC.getWeather = function()
	local weatherType1, weatherType2, percentWeather2 = GetWeatherTypeTransition()
	local currentWeather = percentWeather2 > 0.5 and weatherType2 or weatherType1
	return currentWeather
end

---Set the weather client side
---@param weather string
FUNC.setWeather = function(weather)
	SetWeatherTypeNowPersist(weather)
	SetWeatherTypePersist(weather)
end

FUNC.Draw = function(text, r, g, b, alpha, x, y, width, height, layer, center, font)
	SetTextColour(r, g, b, alpha)
	SetTextFont(font)
	SetTextScale(width, height)
	SetTextWrap(0.0, 1.0)
	SetTextCentre(center)
	SetTextDropshadow(1, 1, 1, 1, 255);
	SetTextEdge(2, 0, 0, 0, 150);
	SetTextOutline(200, 200, 200, 255)
	SetTextEntry("STRING")
	AddTextComponentString(text)
	Citizen.InvokeNative(0x61BB1D9B3A95D802, layer)
	DrawText(x, y)
end

FUNC.QMultiply = function(a, b)
	local axx = a.x * 2
	local ayy = a.y * 2
	local azz = a.z * 2
	local awxx = a.w * axx
	local awyy = a.w * ayy
	local awzz = a.w * azz
	local axxx = a.x * axx
	local axyy = a.x * ayy
	local axzz = a.x * azz
	local ayyy = a.y * ayy
	local ayzz = a.y * azz
	local azzz = a.z * azz
	return vector3(((b.x * ((1.0 - ayyy) - azzz)) + (b.y * (axyy - awzz))) + (b.z * (axzz + awyy)),
		((b.x * (axyy + awzz)) + (b.y * ((1.0 - axxx) - azzz))) + (b.z * (ayzz - awxx)),
		((b.x * (axzz - awyy)) + (b.y * (ayzz + awxx))) + (b.z * ((1.0 - axxx) - ayyy)))
end

FUNC.Lerp = function(a, b, t)
	return a + (b - a) * t
end

FUNC.Draw3DText = function(DrawCoords, text)
	local onScreen, _x, _y = GetScreenCoordFromWorldCoord(DrawCoords.x, DrawCoords.y, DrawCoords.z)
	local px, py, pz = table.unpack(GetFinalRenderedCamCoord())
	local dist = GetDistanceBetweenCoords(px, py, pz, DrawCoords.x, DrawCoords.y, DrawCoords.z, 1)
	local scale = (1 / dist)
	local fov = (1 / GetGameplayCamFov()) * 100
	local scale = scale * fov

	if onScreen then
		SetTextScale(0.0 * scale, 1.1 * scale)
		SetTextFont(0)
		SetTextProportional(1)
		SetTextDropshadow(0, 0, 0, 0, 255)
		SetTextEdge(2, 0, 0, 0, 150)
		SetTextDropShadow()
		SetTextOutline()
		BeginTextCommandDisplayText("STRING")
		SetTextCentre(1)
		AddTextComponentSubstringPlayerName(text)
		EndTextCommandDisplayText(_x, _y)
	end
end

FUNC.saveInteriors = function(array)
	TriggerServerEvent("DMT:saveInteriors", array)
end

FUNC.drawText = function(string, coords)
	SetTextFont(0)
	SetTextProportional(1)
	SetTextScale(0.36, 0.36)
	SetTextColour(255, 255, 255, 255)
	SetTextDropshadow(0, 0, 0, 0, 255)
	SetTextEdge(5, 0, 0, 0, 255)
	SetTextDropShadow()
	SetTextOutline()
	SetTextRightJustify(false)
	SetTextWrap(0, 0.55)
	SetTextEntry("STRING")

	AddTextComponentString(string)
	DrawText(coords.x, coords.y)
end