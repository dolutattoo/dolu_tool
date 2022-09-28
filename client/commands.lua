local noClip = false
local lastCoords

RegisterCommand('goback', function()
    if lastCoords then
        local currentCoords = GetEntityCoords(cache.ped)
        FUNC.setPlayerCoords(cache.vehicle, lastCoords.x, lastCoords.y, lastCoords.z)
        lastCoords = currentCoords
    end
end)

RegisterCommand('tpm', function()
    local marker = GetFirstBlipInfoId(8)

    if marker == 0 then
        lib.notify({
            title = 'Teleport to marker',
            description = 'You did not set any marker!',
            type = 'error'
        })
    else
        local coords = GetBlipInfoIdCoord(marker)

        DoScreenFadeOut(100)
        Wait(100)

        local vehicle = cache.seat == -1 and cache.vehicle
        lastCoords = GetEntityCoords(cache.ped)

        FUNC.freezePlayer(true, vehicle)

        local z, inc, int = 0.0, 20.0, 0

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
                FUNC.setPlayerCoords(vehicle, coords.x, coords.y, groundZ)
                break
            end

            FUNC.setPlayerCoords(vehicle, coords.x, coords.y, z)
            z += inc
        end

        FUNC.freezePlayer(false, vehicle)
        SetGameplayCamRelativeHeading(0)
        DoScreenFadeIn(750)
    end
end)
RegisterKeyMapping('tpm', "~b~>~w~ Teleport to marker", 'keyboard', '')

RegisterCommand('noclip', function()
    noClip = not noClip
    SetFreecamActive(noClip)
end)
RegisterKeyMapping('noclip', "~b~>~w~ Toggle noclip mode", 'keyboard', '')

-- https://github.com/Deltanic/fivem-freecam/
-- https://github.com/tabarra/txAdmin/tree/master/scripts/menu/vendor/freecam