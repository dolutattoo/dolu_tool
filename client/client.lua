local function openUI()
    local locations = lib.callback.await('dmt:getPlayerLocations')
    SendNUIMessage({
        action = 'setMenuVisible',
        data = {
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
    teleportPlayer({ x = data.x, y = data.y, z = data.z, heading = data.heading })
end)

RegisterNUICallback('exit', function()
    SetNuiFocus(false, false)
end)
