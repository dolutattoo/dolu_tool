RegisterCommand('dolu_tool:open', function()
    if Config.Framework == 'ESX' then
        ESX.TriggerServerCallback('dolu_tool:CheckPlayerForIsAdmin', function(IsPlayerAdmin)
            if IsPlayerAdmin == 1 then
                PlayerIsAdmin = true
            else
                PlayerIsAdmin = false  
            end
        end)
    end
    if Config.Framework == 'Standalone' then
        lib.callback('dolu_tool:StandalonePErmsCheckingForEasyType', source, function(IsPlayerAdmin)
            if IsPlayerAdmin == 1 then
                PlayerIsAdmin = true
            else
                PlayerIsAdmin = false  
            end
        end)
    end
    if Config.Framework == 'Everybody' then
        PlayerIsAdmin = true
    end
    if PlayerIsAdmin then
        if not IsNuiFocused() and not IsPauseMenuActive() then
            FUNC.openUI()
        end
    end
end)
RegisterKeyMapping('dolu_tool:open', locale('command_openui', '~o~>~w~'), 'keyboard', Config.openMenuKey)

RegisterCommand('goback', function()
    if Config.Framework == 'ESX' then
        ESX.TriggerServerCallback('dolu_tool:CheckPlayerForIsAdmin', function(IsPlayerAdmin)
            if IsPlayerAdmin == 1 then
                PlayerIsAdmin = true
            else
                PlayerIsAdmin = false  
            end
        end)
    end
    if Config.Framework == 'Standalone' then
        lib.callback('dolu_tool:StandalonePErmsCheckingForEasyType', source, function(IsPlayerAdmin)
            if IsPlayerAdmin == 1 then
                PlayerIsAdmin = true
            else
                PlayerIsAdmin = false  
            end
        end)
    end
    if Config.Framework == 'Everybody' then
        PlayerIsAdmin = true
    end
    if PlayerIsAdmin then
        if not Client.lastCoords then
            lib.notify({
                title = 'Dolu Tool',
                description = locale('cannot_goback'),
                type = 'error',
                position = 'top'
            })
        else
            local currentCoords = GetEntityCoords(cache.ped)
            FUNC.setPlayerCoords(cache.vehicle, Client.lastCoords.x, Client.lastCoords.y, Client.lastCoords.z)
            Client.lastCoords = currentCoords
            lib.notify({
                title = 'Dolu Tool',
                description = locale('teleport_success'),
                type = 'success',
                position = 'top'
            })
        end
    end
end)

RegisterCommand('tpm', function()
    if Config.Framework == 'ESX' then
        ESX.TriggerServerCallback('dolu_tool:CheckPlayerForIsAdmin', function(IsPlayerAdmin)
            if IsPlayerAdmin == 1 then
                PlayerIsAdmin = true
            else
                PlayerIsAdmin = false  
            end
        end)
    end
    if Config.Framework == 'Standalone' then
        lib.callback('dolu_tool:StandalonePErmsCheckingForEasyType', source, function(IsPlayerAdmin)
            if IsPlayerAdmin == 1 then
                PlayerIsAdmin = true
            else
                PlayerIsAdmin = false  
            end
        end)
    end
    if Config.Framework == 'Everybody' then
        PlayerIsAdmin = true
    end
    if PlayerIsAdmin then
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
    end
end)
RegisterKeyMapping('tpm', locale('command_tpm', '~o~>~w~'), 'keyboard', Config.teleportMarkerKey)

RegisterCommand('noclip', function()
    if Config.Framework == 'ESX' then
        ESX.TriggerServerCallback('dolu_tool:CheckPlayerForIsAdmin', function(IsPlayerAdmin)
            if IsPlayerAdmin == 1 then
                PlayerIsAdmin = true
            else
                PlayerIsAdmin = false  
            end
        end)
    end
    if Config.Framework == 'Standalone' then
        lib.callback('dolu_tool:StandalonePErmsCheckingForEasyType', source, function(IsPlayerAdmin)
            if IsPlayerAdmin == 1 then
                PlayerIsAdmin = true
            else
                PlayerIsAdmin = false  
            end
        end)
    end
    if Config.Framework == 'Everybody' then
        PlayerIsAdmin = true
    end
    if PlayerIsAdmin then
        Client.noClip = not Client.noClip
        SetFreecamActive(Client.noClip)
    end
end)
RegisterKeyMapping('noclip', locale('command_noclip', '~o~>~w~'), 'keyboard', Config.toggleNoclipKey)
