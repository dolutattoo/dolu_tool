FUNC = {}
LastEntitySet = nil

FUNC.openUI = function()
    Client.locations = lib.callback.await('dmt:getLocations')
    Client.pedLists = lib.callback.await('dmt:getPedList')
    SendNUIMessage({
        action = 'setMenuVisible',
        data = {
            locations = Client.locations,
            pedLists = Client.pedLists
        }
    })
    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(true)
    isMenuOpen = true
end

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

FUNC.Lerp = function(a, b, t)
    return a + (b - a) * t
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

FUNC.enableEntitySet = function(value)
    local playerPed = PlayerPedId()
    local interiorId = GetInteriorFromEntity(playerPed)

    if IsInteriorEntitySetActive(interiorId, value) then
        DeactivateInteriorEntitySet(interiorId, value)
        LastEntitySet = value
    else
        ActivateInteriorEntitySet(interiorId, value)
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

FUNC.getClock = function()
    return GetClockHours(), GetClockMinutes(), GetClockSeconds()
end

FUNC.setClock = function(hour, minutes, seconds)
    hour = tonumber(hour)
    minutes = tonumber(minutes)
    seconds = tonumber(seconds)
    NetworkOverrideClockTime(hour, minutes, seconds)
end

FUNC.getWeather = function()
    local weatherType1, weatherType2, percentWeather2 = GetWeatherTypeTransition()
    local currentWeather = percentWeather2 > 0.5 and weatherType2 or weatherType1
    return currentWeather
end

FUNC.setWeather = function(weather)
    SetWeatherTypeNowPersist(weather)
    SetWeatherTypePersist(weather)
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

FUNC.Draw3DText = function(DrawCoords, text)
    local onScreen, _x, _y = GetScreenCoordFromWorldCoord(DrawCoords.x, DrawCoords.y, DrawCoords.z)
    local px, py, pz = table.unpack(GetFinalRenderedCamCoord())
    local dist = #(vec3(px, py, pz) - vec3(DrawCoords.x, DrawCoords.y, DrawCoords.z))
    local fov = (1 / GetGameplayCamFov()) * 100
    local scale = (1 / dist) * fov

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

FUNC.DrawFloating = function(DrawCoords, text)
    BeginTextCommandDisplayHelp('FloatingNotification')
    AddTextEntry('FloatingNotification', text)
    EndTextCommandDisplayHelp(2, false, false, -1)
    SetFloatingHelpTextWorldPosition(1, DrawCoords.x, DrawCoords.y, DrawCoords.z + 0.1)
    SetFloatingHelpTextStyle(1, 1, 2, -1, 3, 0)
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

-- Teleport functions (thanks to ox_core)
FUNC.freezePlayer = function(state, vehicle)
    local playerId, ped = cache.playerId, cache.ped
    local entity = vehicle and cache.vehicle or ped

    SetPlayerControl(playerId, not state, 1 << 8)
    SetPlayerInvincible(playerId, state)
    FreezeEntityPosition(entity, state)
    SetEntityCollision(entity, not state)

    if not state and vehicle then
        SetVehicleOnGroundProperly(entity)
    end
end

FUNC.setPlayerCoords = function(vehicle, x, y, z, heading)
    if vehicle then
        return SetPedCoordsKeepVehicle(cache.ped, x, y, z)
    end

    SetEntityCoords(cache.ped, x, y, z, false, false, false, false)
    if heading then
        SetEntityHeading(cache.ped, heading)
    end
end

FUNC.teleportPlayer = function(coords, updateLastCoords)
    assert(type(coords) == 'table', "Trying to teleport player to invalid coords type")
    coords = vec4(coords.x, coords.y, coords.z, coords.heading or 0)

    DoScreenFadeOut(100)
    Wait(100)

    local vehicle = cache.seat == -1 and cache.vehicle

    FUNC.freezePlayer(true, vehicle)

    if updateLastCoords then
        lastCoords = vec4(GetEntityCoords(cache.ped).xyz, GetEntityHeading(cache.ped))
    end

    local z, inc, int = 0.0, 10.0, 0

    while z < 800.0 do
        Wait(0)
        local found, groundZ = GetGroundZFor_3dCoord(coords.x, coords.y, z, false)

        if int == 0 then
            int = GetInteriorAtCoords(coords.x, coords.y, z)

            if int ~= 0 then
                inc = 2.0
            end
        end

        if found then
            FUNC.setPlayerCoords(vehicle, coords.x, coords.y, groundZ, coords.w)
            break
        end

        FUNC.setPlayerCoords(vehicle, coords.x, coords.y, z, coords.w)
        z += inc
    end

    FUNC.freezePlayer(false, vehicle)
    SetGameplayCamRelativeHeading(0)
    DoScreenFadeIn(750)
end

FUNC.changePed = function(model)
    local playerId = cache.playerId
    model = joaat(model)
    RequestModel(model)
    while not HasModelLoaded(model) do Wait(0) end
    SetPlayerModel(playerId, model)
end