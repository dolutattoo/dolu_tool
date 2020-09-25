Citizen.CreateThread(function()
    TriggerServerEvent("DMT:loadInteriors")
end)

RegisterNetEvent("DMT:initInteriors")
AddEventHandler("DMT:initInteriors", function(result)
    interiorsData = result
end)

-- Coords display
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if(coordsOverMap) then
            local playerPed = PlayerPedId()
            local playerCoords = GetEntityCoords(playerPed)
            local playerHeading = GetEntityHeading(playerPed)

            FUNC.Draw("X: " .. FUNC.round(playerCoords.x, 2) .."  Y: " .. FUNC.round(playerCoords.y, 2) .."  Z: " .. FUNC.round(playerCoords.z, 2) .."  H: " .. FUNC.round(playerHeading, 2) .."", 35, 93, 168, 255, 0.0175, 0.77, 0.282, 0.282, 1, false, 0)
        end
    end
end)



-- Interior informations display
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(5)
        if(showInfo) then
            local playerPed = PlayerPedId()
            local interiorId = GetInteriorFromEntity(playerPed)

            if interiorId ~= 0 then
                local roomHash = GetRoomKeyFromEntity(playerPed)
                local roomId = GetInteriorRoomIndexByHash(interiorId, roomHash)
                local roomTimecycle = GetInteriorRoomTimecycle(interiorId, roomId)
                local portalCount = GetInteriorPortalCount(interiorId)
                local roomCount = GetInteriorRoomCount(interiorId)
                local roomFlag = GetInteriorRoomFlag(interiorId, roomId)
                local roomName = GetInteriorRoomName(interiorId, roomId)
                            
                string = "~b~InteriorID: ~w~" .. interiorId
                string = string .. "~n~ ~b~RoomID: ~w~" .. roomId
                string = string .. "~n~ ~b~RoomCount: ~w~" .. roomCount-1
                string = string .. "~n~ ~b~RoomTimecycle: ~w~" .. roomTimecycle
                string2 = "~n~ ~b~portalCount: ~w~" .. portalCount
                string2 = string2 .. "~n~ ~b~roomFlag: ~w~" .. roomFlag
                string2 = string2 .. "~n~ ~b~roomName: ~w~" .. roomName
            else
                string = "~o~You are not in an interior!"
                string2 = ""
            end

            FUNC.drawText(string, {x=0.245, y=0.01})
            FUNC.drawText(string2, {x=0.245, y=0.08})
            RefreshInterior(InteriorId)
        end
    end
end)

-- Portals display
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        
        if(portalPoly or portalLines or portalCorners or portalInfos) then
            local interiorId = GetInteriorFromEntity(PlayerPedId())
            local pedCoords = GetEntityCoords(PlayerPedId())

            if interiorId ~= 0 then
            -- if interiorId ~= 0 then

                local ix, iy, iz = GetInteriorPosition(interiorId)
                local rotX, rotY, rotZ, rotW = GetInteriorRotation(interiorId)
                local YMapInteriorPos = vector3(ix, iy, iz)
                local Orientation = quat(rotW, rotX, rotY, rotZ)
                local countPortals = GetInteriorPortalCount(interiorId)
                local countRooms = GetInteriorRoomCount(interiorId)
                local roomHash = GetRoomKeyFromEntity(PlayerPedId())
                local roomId = GetInteriorRoomIndexByHash(interiorId, roomHash)

                for portalId = 0, countPortals - 1 do
                    local corners = {}
                    local pureCorners = {}
                    for c = 0, 3 do
                        local cx, cy, cz = GetInteriorPortalCornerPosition(interiorId, portalId, c)
                        local cornerPosition = YMapInteriorPos + FUNC.QMultiply(Orientation, vector3(cx, cy, cz))

                        corners[c] = FUNC.round(cornerPosition, 2)
                        pureCorners[c] = vector3(cx, cy, cz)
                    end

                    local longestCVector = { nil, nil, 0.0 }
                    for key,_ in pairs(corners) do
                        for i = 0, 3 do
                            if(#(corners[key] - corners[i]) >= longestCVector[3] and #(corners[key] - corners[i]) > 0.0) then
                                longestCVector = { corners[key], corners[i], #(corners[key] - corners[i]) }
                            end
                        end
                    end

                    if(#(corners[0] - corners[3]) < 7) then
                        longestCVector = { corners[0], corners[3], #(corners[0] - corners[3]) }
                    end

                    local CrossVector = FUNC.Lerp(longestCVector[1], longestCVector[2], 0.5)

                    if portalPoly then
                        DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z, corners[2].x, corners[2].y, corners[2].z, 0, 0, 200, 100)
                        DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[2].x, corners[2].y, corners[2].z, corners[3].x, corners[3].y, corners[3].z, 0, 0, 200, 100)
                        DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[2].x, corners[2].y, corners[2].z, corners[1].x, corners[1].y, corners[1].z, 0, 0, 200, 100)
                        DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[1].x, corners[1].y, corners[1].z, corners[0].x, corners[0].y, corners[0].z, 0, 0, 200, 100)
                    end

                    if portalLines then
                        DrawLine(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z, 255, 0, 0, 255)
                        DrawLine(corners[1].x, corners[1].y, corners[1].z, corners[2].x, corners[2].y, corners[2].z, 255, 0, 0, 255)
                        DrawLine(corners[2].x, corners[2].y, corners[2].z, corners[3].x, corners[3].y, corners[3].z, 255, 0, 0, 255)
                        DrawLine(corners[3].x, corners[3].y, corners[3].z, corners[0].x, corners[0].y, corners[0].z, 255, 0, 0, 255)
                    end


                    if (#(pedCoords - CrossVector) <= 8.0) and portalCorners then
                        FUNC.Draw3DText(corners[0],"~b~C0:~w~ "..FUNC.round(pureCorners[0].x, 2).." "..FUNC.round(pureCorners[0].y, 2).." "..FUNC.round(pureCorners[0].z, 2))
                        FUNC.Draw3DText(corners[1],"~b~C1:~w~ "..FUNC.round(pureCorners[1].x, 2).." "..FUNC.round(pureCorners[1].y, 2).." "..FUNC.round(pureCorners[1].z, 2))
                        FUNC.Draw3DText(corners[2],"~b~C2:~w~ "..FUNC.round(pureCorners[2].x, 2).." "..FUNC.round(pureCorners[2].y, 2).." "..FUNC.round(pureCorners[2].z, 2))
                        FUNC.Draw3DText(corners[3],"~b~C3:~w~ "..FUNC.round(pureCorners[3].x, 2).." "..FUNC.round(pureCorners[3].y, 2).." "..FUNC.round(pureCorners[3].z, 2))
                    end

                    if (#(pedCoords - CrossVector) <= 8.0) and portalInfos then
                        FUNC.Draw3DText(vec(CrossVector.x, CrossVector.y, CrossVector.z+1.9), "~b~Portal ~w~" .. portalId)
                        local portalFlags = GetInteriorPortalFlag(interiorId, portalId)
                        local portalRoomTo = GetInteriorPortalRoomTo(interiorId, portalId)
                        local portalRoomFrom = GetInteriorPortalRoomFrom(interiorId, portalId)
                        FUNC.Draw3DText(vec(CrossVector.x, CrossVector.y, CrossVector.z + 1.7), "~b~From ~w~" .. portalRoomFrom .. "~b~ To ~w~" .. portalRoomTo)
                        FUNC.Draw3DText(vec(CrossVector.x, CrossVector.y, CrossVector.z + 1.5), "~b~Flags ~w~" .. portalFlags)
                    end
                end

            end
        end
    end
end)

-- NocLip
Citizen.CreateThread(function()
	while true do
		Citizen.Wait(0)

		if noClip then
			SetEntityCollision(GetPlayerPed(-1), false, false)
			ClearPedTasksImmediately(GetPlayerPed(-1))
			Citizen.InvokeNative(0x0AFC4AF510774B47)
			if not IsControlPressed(1, 32) and not IsControlPressed(1, 33) and not IsControlPressed(1, 90) and not IsControlPressed(1, 89) then
				FreezeEntityPosition(GetPlayerPed(-1), true)
            end
            local coords = GetEntityForwardVector(GetPlayerPed(-1))
			if IsControlPressed(1, 33) then --Forward
				FreezeEntityPosition(GetPlayerPed(-1), false)
				ApplyForceToEntity(GetPlayerPed(-1), 1, coords.x * 3, coords.y * 3, 0.27, 0.0, 0.0, 0.0, 1, false, true, true, true, true)
			elseif IsControlPressed(1, 32) then --Backward
				FreezeEntityPosition(GetPlayerPed(-1), false)
				ApplyForceToEntity(GetPlayerPed(-1), 1, coords.x * -3, coords.y * -3, 0.27, 0.0, 0.0, 0.0, 1, false, true, true, true, true)
            end
            if IsControlPressed(1, 90) then --Up
				FreezeEntityPosition(GetPlayerPed(-1), false)
				ApplyForceToEntity(GetPlayerPed(-1), 1, 0.0, 0.0, 5.0, 0.0, 0.0, 0.0, 1, false, true, true, true, true)
			elseif IsControlPressed(1, 89) then --Down
				FreezeEntityPosition(GetPlayerPed(-1), false)
				ApplyForceToEntity(GetPlayerPed(-1), 1, 0.0, 0.0, -5.0, 0.0, 0.0, 0.0, 1, false, true, true, true, true)
            end
            local camRot = GetGameplayCamRot(0)
            SetEntityRotation(GetPlayerPed(-1), 0.0, 0.0, camRot.z+180, 1, true)
		end
	end
end)
