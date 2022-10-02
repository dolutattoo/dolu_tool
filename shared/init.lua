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
    end
end)

