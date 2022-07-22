local speeds = { "Minimum", "Très lent", "Lent", "Normal", "Rapide", "Très rapide", "Très très rapide", "Extremement rapide", "Maxmimum" }
local numberOfSpeeds = 9
local MovingSpeed = 0
local FollowCamMode = true
Noclip = false

local InstructionalButtons = {
	{ button = "~INPUT_MOVE_LR~", 		label = "Tourner" 			},
	{ button = "~INPUT_MOVE_UD~", 		label = "Avancer/Reculer" 	},
	{ button = "~INPUT_CONTEXT~", 		label = "Descendre" 		},
	{ button = "~INPUT_COVER~", 		label = "Monter" 			},
	{ button = "~INPUT_VEH_HEADLIGHT~", label = "Mode Caméra" 		},
	{ button = '~INPUT_SPRINT~', 		label = "XXXXXXXXXXXXXXXX" 	},
}


RegisterCommand('noclip', function()
	Noclip = not Noclip
end)
RegisterKeyMapping('noclip', 'Noclip', 'keyboard', 'F11')

CreateThread(function()
	local WasNoClip = false
	InstructionalButtons[6].label = speeds[MovingSpeed+1]..' (Vitesse)'
	while true do
		if Noclip then
			local currentVehicle = GetVehiclePedIsIn(PlayerPedId(), false)
			local playerPed = PlayerPedId()
			local noclipEntity = currentVehicle == 0 and playerPed or currentVehicle

			FreezeEntityPosition(noclipEntity, true)
			SetEntityInvincible(noclipEntity, true)

			local newPos = vector3(0, 0, 0)
			DisableControlAction(0, 32, true)
			DisableControlAction(0, 268, true)
			DisableControlAction(0, 31, true)
			DisableControlAction(0, 269, true)
			DisableControlAction(0, 33, true)
			DisableControlAction(0, 266, true)
			DisableControlAction(0, 34, true)
			DisableControlAction(0, 30, true)
			DisableControlAction(0, 267, true)
			DisableControlAction(0, 35, true)
			DisableControlAction(0, 44, true)
			DisableControlAction(0, 20, true)
			DisableControlAction(0, 74, true)
			DisableControlAction(0, 85, true)

			local yoff = 0.0
			local zoff = 0.0

			if IsInputDisabled(2) and OnscreenKeyboard ~= 0 and not IsPauseMenuActive() then
				if IsControlJustPressed(0, 21) then
					MovingSpeed = MovingSpeed + 1
					if MovingSpeed == numberOfSpeeds then
						MovingSpeed = 0
					end
					InstructionalButtons[6].label = speeds[MovingSpeed+1]..' (Vitesse)'
				end

				if IsDisabledControlPressed(0, 32) then
					yoff = 0.5
				end
				if IsDisabledControlPressed(0, 33) then
					yoff = -0.5
				end
				if not FollowCamMode and IsDisabledControlPressed(0, 34) then
					SetEntityHeading(playerPed, GetEntityHeading(playerPed) + 3.0)
				end
				if not FollowCamMode and IsDisabledControlPressed(0, 35) then
					SetEntityHeading(playerPed, GetEntityHeading(playerPed) - 3.0)
				end
				if IsDisabledControlPressed(0, 44) then
					zoff = 0.21
				end
				if IsDisabledControlPressed(0, 38) then
					zoff = -0.21
				end
				if IsDisabledControlJustPressed(0, 74) then
					FollowCamMode = not FollowCamMode
				end
			end

			local moveSpeed = MovingSpeed
			if MovingSpeed > numberOfSpeeds / 2 then
				moveSpeed = moveSpeed * 1.8
			end
			if MovingSpeed == 0 then
				moveSpeed = -0.2
			end
			moveSpeed = moveSpeed / (1.0 / GetFrameTime()) * 60
			newPos = GetOffsetFromEntityInWorldCoords(noclipEntity, 0.0, yoff * (moveSpeed + 0.3), zoff * (moveSpeed + 0.3))

			local heading = GetEntityHeading(noclipEntity)
			SetEntityVelocity(noclipEntity, 0.0, 0.0, 0.0)
			SetEntityRotation(noclipEntity, 0.0, 0.0, 0.0, 0.0, false)
			SetEntityHeading(noclipEntity, FollowCamMode and GetGameplayCamRelativeHeading() or heading)
			SetEntityCollision(noclipEntity, false, false)
			SetEntityCoordsNoOffset(noclipEntity, newPos.x, newPos.y, newPos.z, true, true, true)

			SetEntityVisible(noclipEntity, false, false)
			SetLocalPlayerVisibleLocally(true)
			SetEntityAlpha(noclipEntity, 51, 0)

			if currentVehicle ~= nil then
				SetHornEnabled(currentVehicle, false)
			end

			SetEntityInvincible(playerPed, true)
			SetEntityAlpha(playerPed, 51, 0)
			SetEveryoneIgnorePlayer(PlayerId(), true)
			SetPoliceIgnorePlayer(PlayerId(), true)

			-- InstructionalScaleform = RageUI.DrawInstructionalButtons(InstructionalScaleform, InstructionalButtons)
			drawInstructionalButtons(InstructionalButtons)
		elseif WasNoClip and not Noclip then
			ResetNoclip()
		else
			Wait(50)
		end

		WasNoClip = Noclip
		Wait(0)
	end
end)

function ResetNoclip()
	local currentVehicle = GetVehiclePedIsIn(PlayerPedId(), false)
	local playerPed = PlayerPedId()
	local noclipEntity = currentVehicle == 0 and playerPed or currentVehicle

	FreezeEntityPosition(noclipEntity, false)
	FreezeEntityPosition(playerPed, false)
	SetEntityInvincible(noclipEntity, false)
	SetEntityInvincible(playerPed, false)
	SetEntityCollision(noclipEntity, true, true)

	SetEntityVisible(noclipEntity, true, false)
	SetLocalPlayerVisibleLocally(true)
	ResetEntityAlpha(noclipEntity)
	ResetEntityAlpha(playerPed)

	SetEveryoneIgnorePlayer(playerPed, false)
	SetPoliceIgnorePlayer(playerPed, false)

	SetHornEnabled(currentVehicle, true)
end

function drawInstructionalButtons(buttons)
	CreateThread(function()
		local scaleform = RequestScaleformMovie('instructional_buttons')
		while not HasScaleformMovieLoaded(scaleform) do
			Wait(0)
		end

		PushScaleformMovieFunction(scaleform, 'CLEAR_ALL')
		PushScaleformMovieFunction(scaleform, 'TOGGLE_MOUSE_BUTTONS')
		PushScaleformMovieFunctionParameterBool(0)
		PopScaleformMovieFunctionVoid()

		for i,v in ipairs(buttons) do
			PushScaleformMovieFunction(scaleform, 'SET_DATA_SLOT')
			PushScaleformMovieFunctionParameterInt(i-1)
			Citizen.InvokeNative(0xE83A3E3557A56640, v.button)
			PushScaleformMovieFunctionParameterString(v.label)
			PopScaleformMovieFunctionVoid()
		end

		PushScaleformMovieFunction(scaleform, 'DRAW_INSTRUCTIONAL_BUTTONS')
		PushScaleformMovieFunctionParameterInt(-1)
		PopScaleformMovieFunctionVoid()
		DrawScaleformMovieFullscreen(scaleform, 255, 255, 255, 255)
	end)
end