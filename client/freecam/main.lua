local vector3 = vector3
local IsPauseMenuActive = IsPauseMenuActive
local GetSmartControlNormal = GetSmartControlNormal

local SETTINGS = _G.CONTROL_SETTINGS
local CONTROLS = _G.CONTROL_MAPPING

local faster, slower = false, false

local speedMultiplier = SETTINGS.BASE_MOVE_MULTIPLIER
-------------------------------------------------------------------------------
local function GetSpeedMultiplier()
	local frameMultiplier = GetFrameTime() * 60

	if IsDisabledControlPressed(0, CONTROLS.MOVE_SLOW) then -- Scroll Up
		if speedMultiplier > 1.0 then
			speedMultiplier = speedMultiplier - 0.5
		elseif speedMultiplier > 0.2 then
			speedMultiplier = speedMultiplier - 0.1
		else
			speedMultiplier = speedMultiplier - 0.01
		end
	elseif IsDisabledControlPressed(0, CONTROLS.MOVE_FAST) then -- Scroll Down
		if speedMultiplier < 0.2 then
			speedMultiplier = speedMultiplier + 0.01
		elseif speedMultiplier > 1.0 then
			speedMultiplier = speedMultiplier + 0.5
		else
			speedMultiplier = speedMultiplier + 0.1
		end
	end

	-- Hold shift to go faster
	if IsControlJustPressed(0, 21) and not slower then
		faster = true
		speedMultiplier = speedMultiplier*5
	end
	if IsControlJustReleased(0, 21) and faster and not slower then
		faster = false
		speedMultiplier = speedMultiplier/5
	end

	-- Hold Alt to go slower
	if IsControlJustPressed(0, 19) and not faster then
		slower = true
		speedMultiplier = speedMultiplier/5
	end
	if IsControlJustReleased(0, 19) and slower and not faster then
		slower = false
		speedMultiplier = speedMultiplier*5
	end

	if speedMultiplier <= 0.0 then
		speedMultiplier = 0.01
	end
	if speedMultiplier > 15.0 then
		speedMultiplier = 15.0
	end

	return speedMultiplier * frameMultiplier
end

local function UpdateCamera()
	if not IsFreecamActive() or IsPauseMenuActive() then
		return
	end

	if not IsFreecamFrozen() then
		local vecX, vecY = GetFreecamMatrix()
		local vecZ = vector3(0, 0, 1)

		local pos = GetFreecamPosition()
		local rot = GetFreecamRotation()

		-- Get speed multiplier for movement
		local speedMultiplier = GetSpeedMultiplier()

		-- Get rotation input
		local lookX
		local lookY
		if Client.isMenuOpen then
			if IsDisabledControlPressed(0, 25) then
				lookX = GetSmartControlNormal(CONTROLS.LOOK_X)
				lookY = GetSmartControlNormal(CONTROLS.LOOK_Y)
            else
                lookX = 0
                lookY = 0
            end
		else
            lookX = GetSmartControlNormal(CONTROLS.LOOK_X)
            lookY = GetSmartControlNormal(CONTROLS.LOOK_Y)
        end

		-- Get position input
		local moveX = GetSmartControlNormal(CONTROLS.MOVE_X)
		local moveY = GetSmartControlNormal(CONTROLS.MOVE_Y)
		local moveZ = GetSmartControlNormal(CONTROLS.MOVE_Z)

		-- Calculate new rotation.
		local rotX = rot.x + (-lookY * SETTINGS.LOOK_SENSITIVITY_X)
		local rotZ = rot.z + (-lookX * SETTINGS.LOOK_SENSITIVITY_Y)
		local rotY = rot.y

		-- Adjust position relative to camera rotation.
		pos = pos + (vecX * moveX * speedMultiplier)
		pos = pos + (vecY * -moveY * speedMultiplier)
		pos = pos + (vecZ * moveZ * speedMultiplier)

		-- Adjust new rotation
		rot = vector3(rotX, rotY, rotZ)

		-- Update camera

		if pos ~= GetFreecamPosition() then
			SetFreecamPosition(pos)
		end

		SetFreecamRotation(rot)

		return pos, rotZ
	end

	-- Trigger a tick event. Resources depending on the freecam position can
	-- make use of this event.
	-- TriggerEvent('freecam:onTick')
end

-------------------------------------------------------------------------------
function StartFreecamThread()
	-- Camera/Pos updating thread
	CreateThread(function()
		local ped = cache.ped
		SetFreecamPosition(GetEntityCoords(ped))

		local function updatePos(pos, rotZ)
			if pos then
				-- Update ped
				SetEntityCoords(ped, pos.x, pos.y, pos.z)

				-- Update veh
				local veh = cache.seat == -1 and cache.vehicle

				if veh then
					SetEntityCoords(veh, pos.x, pos.y, pos.z)
				end

				SetEntityHeading(ped, rotZ)

				-- God mode
				SetEntityHealth(ped, GetEntityMaxHealth(ped))
			end
		end

		local frameCounter = 0
		local loopPos, loopRotZ
		while IsFreecamActive() do
			loopPos, loopRotZ = UpdateCamera()
			frameCounter += 1
			if frameCounter > 100 then
				frameCounter = 0
				updatePos(loopPos, loopRotZ)
			end
			Wait(0)
		end

		-- One last time due to the optimization
		updatePos(loopPos, loopRotZ)
	end)

	local function InstructionalButton(controlButton, text)
		ScaleformMovieMethodAddParamPlayerNameString(controlButton)
		BeginTextCommandScaleformString("STRING")
		AddTextComponentScaleform(text)
		EndTextCommandScaleformString()
	end

	--Scaleform drawing thread
	CreateThread(function()
		local scaleform = RequestScaleformMovie("instructional_buttons")
		while not HasScaleformMovieLoaded(scaleform) do
			Wait(1)
		end
		PushScaleformMovieFunction(scaleform, "CLEAR_ALL")
		PopScaleformMovieFunctionVoid()

		PushScaleformMovieFunction(scaleform, "SET_CLEAR_SPACE")
		PushScaleformMovieFunctionParameterInt(200)
		PopScaleformMovieFunctionVoid()

		PushScaleformMovieFunction(scaleform, "SET_DATA_SLOT")
		PushScaleformMovieFunctionParameterInt(0)
		InstructionalButton(GetControlInstructionalButton(0, 348, 1), "Speed")
		PopScaleformMovieFunctionVoid()

		PushScaleformMovieFunction(scaleform, "SET_DATA_SLOT")
		PushScaleformMovieFunctionParameterInt(1)
		InstructionalButton(GetControlInstructionalButton(0, 21, 1), "Faster")
		PopScaleformMovieFunctionVoid()

		PushScaleformMovieFunction(scaleform, "SET_DATA_SLOT")
		PushScaleformMovieFunctionParameterInt(2)
		InstructionalButton(GetControlInstructionalButton(0, CONTROLS.MOVE_Y, 1), "Fwd/Back")
		PopScaleformMovieFunctionVoid()

		PushScaleformMovieFunction(scaleform, "SET_DATA_SLOT")
		PushScaleformMovieFunctionParameterInt(3)
		InstructionalButton(GetControlInstructionalButton(0, CONTROLS.MOVE_X, 1), "Left/Right")
		PopScaleformMovieFunctionVoid()

		PushScaleformMovieFunction(scaleform, "SET_DATA_SLOT")
		PushScaleformMovieFunctionParameterInt(4)
		InstructionalButton(GetControlInstructionalButton(0, CONTROLS.MOVE_Z[2], 1), "Down")
		PopScaleformMovieFunctionVoid()

		PushScaleformMovieFunction(scaleform, "SET_DATA_SLOT")
		PushScaleformMovieFunctionParameterInt(5)
		InstructionalButton(GetControlInstructionalButton(0, CONTROLS.MOVE_Z[1], 1), "Up")
		PopScaleformMovieFunctionVoid()

		PushScaleformMovieFunction(scaleform, "DRAW_INSTRUCTIONAL_BUTTONS")
		PopScaleformMovieFunctionVoid()

		PushScaleformMovieFunction(scaleform, "SET_BACKGROUND_COLOUR")
		PushScaleformMovieFunctionParameterInt(0)
		PushScaleformMovieFunctionParameterInt(0)
		PushScaleformMovieFunctionParameterInt(0)
		PushScaleformMovieFunctionParameterInt(80)
		PopScaleformMovieFunctionVoid()

		while IsFreecamActive() do
			DrawScaleformMovieFullscreen(scaleform, 255, 255, 255, 255, 0)
			Wait(0)
		end
		SetScaleformMovieAsNoLongerNeeded()
	end)
end

--------------------------------------------------------------------------------

-- When the resource is stopped, make sure to return the camera to the player.
AddEventHandler('onResourceStop', function(name)
	if name ~= RESOURCE_NAME then return end
	SetFreecamActive(false)
end)
