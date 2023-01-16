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
    local coords = GetEntityCoords(cache.ped)
    SendNUIMessage({
        action = 'setMenuVisible',
        data = {
            lastLocation = Client.lastLocation,
            locations = Client.data.locations,
            pedLists = Client.data.peds,
            vehicleLists = Client.data.vehicles,
            position = coords.x .. ', ' .. coords.y .. ', ' .. coords.z,
            weaponLists = Client.data.weapons
        }
    })
    if Client.currentTab == 'home' then
        FUNC.setMenuPlayerCoords()
    end
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

FUNC.setTimecycle = function(timecycle, roomId)
    --Todo: if 'timecycle' is string with and doesnt contains number, get hash key
    timecycle = timecycle:lower()

    if Client.interiorId ~= 0 then
        if not roomId then
            local roomHash = GetRoomKeyFromEntity(cache.ped)
            roomId = GetInteriorRoomIndexByHash(Client.interiorId, roomHash)
        end

        SetInteriorRoomTimecycle(Client.interiorId, roomId, timecycle)
        RefreshInterior(Client.interiorId)
    else
        SetTimecycleModifier(timecycle)
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

FUNC.setMenuPlayerCoords = function()
    local coords = GetEntityCoords(cache.ped)
    SendNUIMessage({
        action = 'playerCoords',
        data = {
            coords = FUNC.round(coords.x, 3) .. ", " .. FUNC.round(coords.y, 3) .. ", " .. FUNC.round(coords.z, 3),
            heading = tostring(FUNC.round(GetEntityHeading(cache.ped), 3))
        }
    })
end

FUNC.teleportPlayer = function(coords, updateLastCoords)
    assert(type(coords) == 'table', "Trying to teleport player to invalid coords type")
    coords = vec4(coords.x, coords.y, coords.z, coords.heading or 0)

    if Client.noClip then
        if updateLastCoords then
            lastCoords = vec4(GetEntityCoords(cache.ped).xyz, GetEntityHeading(cache.ped))
        end
        setGameplayCamCoords(coords)
    end

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
    lib.requestModel(model)
    SetPlayerModel(playerId, model)
    cache.ped = PlayerPedId()
end

FUNC.spawnVehicle = function(model, coords)
    if type(model) == 'string' then model = joaat(model) end
    -- FUNC.assert(IsModelInCdimage(model), "Model %s does not exists", model)

    local playerPed = cache.ped

    local oldVehicle = GetVehiclePedIsIn(playerPed, false)
    if oldVehicle > 0 and GetPedInVehicleSeat(oldVehicle, -1) == playerPed then
        DeleteVehicle(oldVehicle)
    end

    if not coords then
        coords = GetEntityCoords(playerPed)
    end

    lib.requestModel(model)
    local vehicle = CreateVehicle(model, coords.x, coords.y, coords.z, GetEntityHeading(playerPed), true, true)
    
    TaskWarpPedIntoVehicle(playerPed, vehicle, -1)
    SetVehicleRadioEnabled(vehicle, false)
    SetVehicleDirtLevel(vehicle, 0.0)
    SetVehicleNumberPlateText(vehicle, " ~DMT~ ")
    cache.vehicle = vehicle
end

FUNC.listFlags = function(totalFlags, type)
    local all_flags = { 
        portal = { 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192 },
        room = { 1, 2, 4, 8, 16, 32, 64, 128, 256, 512 }
    }
    
    if not all_flags[type] then return end
    
    local flags = {}
    for _, flag in ipairs(all_flags[type]) do
        if totalFlags & flag ~= 0 then
            flags[#flags+1] = tostring(flag)
        end
    end

    local result = {}
    for i, flag in ipairs(flags) do
        result[#result+1] = tostring(flag)
    end

    return result
end

FUNC.quat2Euler = function(x, y, z, w)
    local q0 = w
    local q1 = x
    local q2 = y
    local q3 = z

    local Rx = math.atan2(2 * (q0 * q1 + q2 * q3), 1 - (2 * (q1 * q1 + q2 * q2)))
    local Ry = math.asin(2 * (q0 * q2 - q3 * q1))
    local Rz = math.atan2(2 * (q0 * q3 + q1 * q2), 1 - (2  * (q2 * q2 + q3 * q3)))

    local euler = vec3(Rx, Ry, Rz) * 180 / math.pi
    return euler
end

FUNC.rotationToDirection = function(rotation)
	local adjustedRotation = vec3(
        (math.pi / 180) * rotation.x,
        (math.pi / 180) * rotation.y,
        (math.pi / 180) * rotation.z
    )
	local direction = vec3(
        -math.sin(adjustedRotation.z) * math.abs(math.cos(adjustedRotation.x)),
        math.cos(adjustedRotation.z) * math.abs(math.cos(adjustedRotation.x)),
        math.sin(adjustedRotation.x)
    )
	return direction
end

FUNC.initTarget = function()
    if not Config.target then return end

    exports.ox_target:addGlobalObject({
        {
            name = 'ox:option1',
            icon = 'fa-solid fa-clipboard-list',
            label = 'Copy coords',
            distance = 10,
            onSelect = function(data)
                lib.setClipboard(data.coords.x .. ', ' .. data.coords.y .. ', ' .. data.coords.z)
                lib.notify({type="success", description="Coords copied to clipboard!"})
            end
        },
        {
            name = 'ox:option2',
            icon = 'fa-solid fa-maximize',
            label = 'Move object',
            distance = 10,
            canInteract = function()
                return Client.gizmoEntity == nil
            end,
            onSelect = function(data)
                SendNUIMessage({
                    action = 'setGizmoEntity',
                    data = {
                        name = 'Unknown Game Object',
                        handle = data.entity,
                        position = GetEntityCoords(data.entity),
                        rotation = GetEntityRotation(data.entity),
                    }
                })
                Client.gizmoEntity = data.entity
                SetNuiFocus(true, true)
                SetNuiFocusKeepInput(true)
                lib.notify({type="inform", description="Press 'Escape' to exit edit mode!"})
            end
        },
        {
            name = 'ox:option4',
            icon = 'fa-solid fa-down-long',
            label = 'Snap to ground',
            distance = 10,
            onSelect = function(data)
                PlaceObjectOnGroundProperly(data.entity)
            end
        },
        {
            name = 'ox:option5',
            icon = 'fa-solid fa-trash',
            label = 'Delete entity',
            distance = 10,
            onSelect = function(data)
                SetEntityAsMissionEntity(data.entity)
                DeleteEntity(data.entity)
            end
        }
    })
end

FUNC.getPages = function(page, table)
    local perPage = 5 -- number of entries per page
    local start = (page - 1) * perPage + 1 -- start index of the page
    local finish = start + perPage - 1 -- end index of the page
    local pageContent = {}

    for i = start, math.min(finish, #table) do
        pageContent[#pageContent+1] = table[i]
    end

    return pageContent
end

FUNC.loadPage = function(listType, activePage, filter, checkboxes)
    local totalList = Client.data[listType]
    local filteredList = {}

    if listType == 'locations' and not checkboxes then
        checkboxes = Client.locationsCheckboxes
    end
    
    -- Filter list from search input
    if filter and filter ~= "" or checkboxes ~= nil then
        local searchResult = {}

        Client.locationsCheckboxes = checkboxes

        if listType == 'locations' then
            for i, value in pairs(totalList) do
                if (value.custom and checkboxes.custom) or (not value.custom and checkboxes.vanilla) then
                    if (not filter or filter == "") or string.match(string.lower(value.name), string.lower(filter)) then
                        table.insert(searchResult, value)
                    end
                end
            end
        else
            for i, value in ipairs(totalList) do
                if string.match(string.lower(value.name), string.lower(filter)) then
                    table.insert(searchResult, value)
                end
            end
        end

        filteredList = searchResult
    else
        filteredList = totalList
    end
    
    local result = {}
    local total = #totalList   
    local result = FUNC.getPages(activePage, filteredList)

    SendNUIMessage({
        action = 'setPageContent',
        data = {
            type = listType,
            content = result,
            maxPages = math.ceil(#filteredList/5)
        }
    })
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
            title = 'Dolu Tool',
            description = msg:format(tostring(value)),
            type = 'error',
            position = 'top'
        })
    else
        assert(v, '^5[' .. RESOURCE_NAME .. '] ^1' .. msg .. '^7')
        lib.notify({
            title = 'Dolu Tool',
            description = msg,
            type = 'error',
            position = 'top'
        })
    end
end
