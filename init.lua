RESOURCE_NAME = GetCurrentResourceName()

CreateThread(function()
    if IsDuplicityVersion() then
        Server = {}
    else
        Client = {}
        isMenuOpen = false
    end
end)