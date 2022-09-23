local function openUI()
    local locations = lib.callback.await('ox_banking:getPlayerLocations')
    SendNUIMessage({
        action = 'setMenuVisible',
        data = {
            character = {
                cashBalance = cash,
                groups = player.groups
            },
            locations = locations
        }
    })
    SetNuiFocus(true, true)
end

CreateThread(function()
    while true do
        if not IsNuiFocused() and not IsPauseMenuActive() then
            if IsControlJustPressed(0, 170) then -- F3
                openUI()
            end
        end
        Wait(0)
    end
end)

RegisterNUICallback('teleportToLocation', function(data)
    local playerPed = PlayerPedId()
    SetEntityCoords(playerPed, data.x, data.y, data.z)
    if data.heading then
        SetEntityHeading(playerPed, data.heading or 0)
    end
end)

RegisterNUICallback('exit', function()
    SetNuiFocus(false, false)
end)
