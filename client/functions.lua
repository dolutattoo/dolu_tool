-- Teleport functions (thanks to ox_core)
local function freezePlayer(state, vehicle)
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

local function teleport(vehicle, x, y, z, heading)
    if vehicle then
        return SetPedCoordsKeepVehicle(cache.ped, x, y, z)
    end

    SetEntityCoords(cache.ped, x, y, z, false, false, false, false)
    if heading then
        SetEntityHeading(cache.ped, heading)
    end
end

function teleportPlayer(coords)
    assert(type(coords) == 'table', "Trying to teleport player to invalid coords type")
    coords = vec(coords.x, coords.y, coords.z, coords.heading)

    DoScreenFadeOut(100)
    Wait(100)

    local vehicle = cache.seat == -1 and cache.vehicle

    freezePlayer(true, vehicle)

    local z, inc, int = 0.0, 2.0, 0

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
            teleport(vehicle, coords.x, coords.y, groundZ, coords.w)
            break
        end

        teleport(vehicle, coords.x, coords.y, z, coords.w)
        z += inc
    end

    freezePlayer(false, vehicle)
    SetGameplayCamRelativeHeading(0)
    DoScreenFadeIn(750)
end