local noClip = false

RegisterCommand('dmt:open', function()
    if not IsNuiFocused() and not IsPauseMenuActive() then
        FUNC.openUI()
    end
end)
RegisterKeyMapping('dmt:open', locale('command_openui', '~o~>~w~'), 'keyboard', 'F3')

RegisterCommand('goback', function()
    if not Client.lastCoords then
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = locale('cannot_goback'),
            type = 'error',
            position = 'top'
        })
    else
        local currentCoords = GetEntityCoords(cache.ped)
        FUNC.setPlayerCoords(cache.vehicle, Client.lastCoords.x, Client.lastCoords.y, Client.lastCoords.z)
        Client.lastCoords = currentCoords
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = locale('teleport_success'),
            type = 'success',
            position = 'top'
        })
    end
end)

RegisterCommand('tpm', function()
    local marker = GetFirstBlipInfoId(8)

    if marker == 0 then
        lib.notify({
            title = 'Dolu Mapping Tool',
            description = locale('no_marker'),
            type = 'error',
            position = 'top'
        })
    else
        local coords = GetBlipInfoIdCoord(marker)

        DoScreenFadeOut(100)
        Wait(100)

        local vehicle = cache.seat == -1 and cache.vehicle
        Client.lastCoords = GetEntityCoords(cache.ped)

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
RegisterKeyMapping('tpm', locale('command_tpm', '~o~>~w~'), 'keyboard', '')

RegisterCommand('noclip', function()
    noClip = not noClip
    SetFreecamActive(noClip)
end)
RegisterKeyMapping('noclip', locale('command_noclip', '~o~>~w~'), 'keyboard', '')

-- https://github.com/Deltanic/fivem-freecam/
-- https://github.com/tabarra/txAdmin/tree/master/scripts/menu/vendor/freecam