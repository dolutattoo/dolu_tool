FUNC = {}
LastEntitySet = nil
local WEATHER_LIST = {
    [`CLEAR`] = 'clear',
    [`EXTRASUNNY`] = 'extrasunny',
    [`NEUTRAL`] = 'neutral',
    [`SMOG`] = 'smog',
    [`FOGGY`] = 'foggy',
    [`OVERCAST`] = 'overcast',
    [`CLOUDS`] = 'clouds',
    [`CLEARING`] = 'clearing',
    [`RAIN`] = 'rain',
    [`THUNDER`] = 'thunder',
    [`SNOW`] = 'snow',
    [`BLIZZARD`] = 'blizzard',
    [`SNOWLIGHT`] = 'snowlight',
    [`XMAS`] = 'xmas',
    [`HALLOWEEN`] = 'halloween'
}

FUNC.openUI = function()
    SendNUIMessage({
        action = 'setMenuVisible',
        data = {
            locations = Client.locations,
            lastLocation = Client.lastLocation,
            pedLists = Client.pedLists,
            vehicleLists = Client.vehicleLists
        }
    })
    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(true)
    Client.isMenuOpen = true
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
    local playerPed = cache.ped

    if Client.interiorId ~= 0 then
        local roomHash = GetRoomKeyFromEntity(playerPed)
        local roomId = GetInteriorRoomIndexByHash(Client.interiorId, roomHash)
        local timecycleHash = GetHashKey(name)

        SetInteriorRoomTimecycle(Client.interiorId, roomId, timecycleHash)
        RefreshInterior(Client.interiorId)
    else
        SetTimecycleModifier(name)
    end
end

FUNC.setPortalFlag = function(portal, flag)
    if Client.interiorId ~= 0 then
        local portalIndex = tonumber(portal)
        local newFlag = tonumber(flag)

        SetInteriorPortalFlag(Client.interiorId, portalIndex, newFlag)
        RefreshInterior(Client.interiorId)
    end
end

FUNC.setRoomFlag = function(flag)
    local playerPed = cache.ped
    local roomHash = GetRoomKeyFromEntity(playerPed)
    local roomId = GetInteriorRoomIndexByHash(Client.interiorId, roomHash)

    if Client.interiorId ~= 0 and roomId ~= -1 then
        local newFlag = tonumber(flag)
        SetInteriorRoomFlag(Client.interiorId, roomId, newFlag)
        RefreshInterior(Client.interiorId)
    end
end

FUNC.enableEntitySet = function(value)
    if IsInteriorEntitySetActive(Client.interiorId, value) then
        DeactivateInteriorEntitySet(Client.interiorId, value)
        LastEntitySet = value
    else
        ActivateInteriorEntitySet(Client.interiorId, value)
        LastEntitySet = value
    end

    RefreshInterior(Client.interiorId)
end

FUNC.toggleLastEntitySet = function()
    if LastEntitySet ~= nil then
        if IsInteriorEntitySetActive(Client.interiorId, LastEntitySet) then
            DeactivateInteriorEntitySet(Client.interiorId, tostring(LastEntitySet))
            RefreshInterior(Client.interiorId)
            print("EntitySet ^5" .. tostring(LastEntitySet) .. " ^1disabled")
        else
            ActivateInteriorEntitySet(Client.interiorId, tostring(LastEntitySet))
            RefreshInterior(Client.interiorId)
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
    return WEATHER_LIST[currentWeather]
end

FUNC.setWeather = function(weather)
    local found
    for hash, v in pairs(WEATHER_LIST) do
        if v == weather:lower() then
            found = hash
            break
        end
    end
    FUNC.assert(WEATHER_LIST[found] == nil, locale('command_weather_notfound', tostring(weather)))
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

    DoScreenFadeOut(150)
    Wait(150)

    local vehicle = cache.seat == -1 and cache.vehicle

    FUNC.freezePlayer(true, vehicle)

    if updateLastCoords then
        lastCoords = vec4(GetEntityCoords(cache.ped).xyz, GetEntityHeading(cache.ped))
    end

    local z, inc, int = 0.0, 1.0, coords.z - 20

    while z < 800.0 do
        Wait(0)
        local found, groundZ = GetGroundZFor_3dCoord(coords.x, coords.y, z, false)

        if int == 0 then
            int = GetInteriorAtCoords(coords.x, coords.y, z)

            if int ~= 0 then
                inc = 0.1
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
    DoScreenFadeIn(500)
end

FUNC.changePed = function(model)
    if type(model) == 'string' then model = joaat(model) end
    FUNC.assert(IsModelInCdimage(model), "Model %s does not exists", model)

    local playerId = cache.playerId
    RequestModel(model)
    while not HasModelLoaded(model) do Wait(0) end
    SetPlayerModel(playerId, model)
    cache.ped = PlayerPedId()
end

FUNC.spawnVehicle = function(model)
    if type(model) == 'string' then model = joaat(model) end
    -- FUNC.assert(IsModelInCdimage(model), "Model %s does not exists", model)

    local playerId = PlayerPedId()
    local playerCoords = GetEntityCoords(playerId)
    local playerHeading = GetEntityHeading(playerId)

    local oldVehicle = GetVehiclePedIsIn(playerId, false)
    if oldVehicle ~= nil then
        SetEntityAsMissionEntity(oldVehicle, true, true)
        DeleteVehicle(oldVehicle)
    end

    RequestModel(model)
    while not HasModelLoaded(model) do Wait(0) end
    local vehicle = CreateVehicle(model, playerCoords.x, playerCoords.y, playerCoords.z, playerHeading, true, true)
    TaskWarpPedIntoVehicle(playerId, vehicle, -1)
    SetVehicleRadioEnabled(vehicle, false)
    SetVehicleDirtLevel(vehicle, 0.0)
    SetVehicleNumberPlateText(vehicle, " ~DMT~ ")
    cache.vehicle = vehicle
end

---Assert with styling and formatting
---@param v any
---@param msg string
---@param value boolean|string|number|table
FUNC.assert = function(v, msg, value)
    if not v or not msg then return end

    if value then
        if type(value) == "table" then
            value = json.decode(value, { indent = true })
        end
        assert(v, '^5[' .. RESOURCE_NAME .. '] ^1' .. msg:format('^5' .. tostring(value) .. '^7'))
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = msg:format(tostring(value)),
            type = 'error',
            position = 'top'
        })
    else
        assert(v, '^5[' .. RESOURCE_NAME .. '] ^1' .. msg .. '^7')
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = msg,
            type = 'error',
            position = 'top'
        })
    end
end

---Debug with styling and formatting
---@param msg string
---@param value? boolean|string|number|table
FUNC.debug = function(msg, value)
    if not msg then return end

    if Config.debug then
        if value then
            if type(value) == "table" then
                value = json.decode(value, {indent=true})
            end
            print('^5[' .. RESOURCE_NAME .. '] ^7' .. msg:format('^5' .. tostring(value) .. '^7'))
        else
            print('^5[' .. RESOURCE_NAME .. '] ^7' .. msg .. '^7')
        end
    end
end
