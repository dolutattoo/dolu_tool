RESOURCE_NAME = GetCurrentResourceName()

CreateThread(function()
    if IsDuplicityVersion() then
        Server = {}
    else
        Client = {}
    end
end)