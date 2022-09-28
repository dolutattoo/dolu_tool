RESOURCE_NAME = GetCurrentResourceName()

CreateThread(function()
    if IsDuplicityVersion() then
        Server = {}
        TriggerEvent('ox_lib:setLocale', Config.locale)
    else
        Client = {}
        isMenuOpen = false
        lastCoords = nil
    end
end)

