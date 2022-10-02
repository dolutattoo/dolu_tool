RESOURCE_NAME = GetCurrentResourceName()
lib.locale()

CreateThread(function()
    if IsDuplicityVersion() then
        Server = {}
        TriggerEvent('ox_lib:setLocale', Config.locale)
    else
        Client = {}
        isMenuOpen = false
        lastCoords = nil
        -- Portal checkboxes
        portalPoly = false
        portalLinesportalPoly = false
        portalCornersportalPoly = false
        portalInfos = false

        interiorId = GetInteriorFromEntity(cache.ped)
        CreateThread(function()
            while true do
                Wait(100)
                interiorId = GetInteriorFromEntity(cache.ped)
            end
        end)
    end
end)

