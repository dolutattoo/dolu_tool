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
            local coords = GetBlipInfoIdCoord(marker)

            Utils.teleportPlayer(coords, true)
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
        local currentCoords = GetEntityCoords(cache.ped)

        Utils.setPlayerCoords(cache.vehicle, Client.lastCoords.x, Client.lastCoords.y, Client.lastCoords.z)
        Client.lastCoords = currentCoords
        lib.notify({
            title = 'Dolu Tool',
            description = locale('teleport_success'),
            type = 'success',
            position = 'top'
        })
    end
end)
