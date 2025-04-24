lib.addKeybind({
    name = 'dolu_tool:open',
    description = locale('command_openui', '~b~>~w~'),
    defaultKey = Config.openMenuKey,
    onPressed = function(self)
        if Config.usePermission and not lib.callback.await('dolu_tool:isAllowed', 100, true) then return end

        if not IsNuiFocused() and not IsPauseMenuActive() then
            Utils.openUI()
        end
    end
})

-- TPM command inspired by ox_commands
-- Original work Copyright (C) Overextended
-- Modified version under GPL-3.0 license
lib.addKeybind({
    name = 'tpm',
    description = locale('command_tpm', '~b~>~w~'),
    defaultKey = Config.teleportMarkerKey,
    onPressed = function(self)
        if Config.usePermission and not lib.callback.await('dolu_tool:isAllowed', 100, true) then return end

        local marker = GetFirstBlipInfoId(8)

        if marker == 0 then
            lib.notify({
                title = 'Dolu Tool',
                description = locale('no_marker'),
                type = 'error',
                position = 'top'
            })
        else
            local entity = cache.seat == -1 and cache.vehicle or cache.ped
            local currentCoords = GetEntityCoords(entity)

            Client.lastCoords = vec4(currentCoords.x, currentCoords.y, currentCoords.z, GetEntityHeading(entity))

            local coords = GetBlipInfoIdCoord(marker)
            local heading = GetEntityHeading(entity)
            local z = GetHeightmapBottomZForPosition(coords.x, coords.y)
            local inc = 10.0

            DoScreenFadeOut(150)
            while not IsScreenFadedOut() do
                Wait(0)
            end

            local setCoords = Utils.setPlayerCoords

            while z < 800.0 do
                Wait(0)
                local found, groundZ = GetGroundZFor_3dCoord(coords.x, coords.y, z, false)
                local int = GetInteriorAtCoords(coords.x, coords.y, z)

                if found or int ~= 0 then
                    if int ~= 0 then
                        local _, _, intZ = GetInteriorPosition(int)
                        groundZ = intZ
                        found = true
                    end
                end

                if found then
                    setCoords(coords.x, coords.y, groundZ, heading, true)
                    break
                end

                setCoords(coords.x, coords.y, z, heading, true)
                z += inc
            end

            Utils.freezePlayer(false, cache.seat == -1)

            SetGameplayCamRelativeHeading(0)

            Wait(250)
            DoScreenFadeIn(150)
        end
    end
})

lib.addKeybind({
    name = 'noclip',
    description = locale('command_noclip', '~b~>~w~'),
    defaultKey = Config.toggleNoclipKey,
    onPressed = function(self)
        if Config.usePermission and not lib.callback.await('dolu_tool:isAllowed', 100, true) then return end

        Client.noClip = not Client.noClip
        SetFreecamActive(Client.noClip)
    end
})

RegisterCommand('goback', function()
    if Config.usePermission and not lib.callback.await('dolu_tool:isAllowed', 100, true) then return end

    if not Client.lastCoords then
        lib.notify({
            title = 'Dolu Tool',
            description = locale('cannot_goback'),
            type = 'error',
            position = 'top'
        })
    else
        Utils.teleportPlayer(Client.lastCoords, true)

        lib.notify({
            title = 'Dolu Tool',
            description = locale('teleport_success'),
            type = 'success',
            position = 'top'
        })
    end
end)
