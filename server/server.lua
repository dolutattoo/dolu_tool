---@param path string
---@param file string
---@return table
local function getFileData(path, file)
    return json.decode(LoadResourceFile(RESOURCE_NAME, path .. '/' .. file .. '.json'))
end

---@param path string
---@param file string
---@param data table
---@return boolean success
local function updateFileData(path, file, data)
    print(SaveResourceFile(RESOURCE_NAME, path .. '/' .. file .. '.json', json.encode(data)))
end

lib.callback.register('dmt:getLocations', function()
    Server.locations = getFileData('shared/data', 'locations')
    return Server.locations
end)

lib.callback.register('dmt:renameLocation', function(source, oldName, newName)
    local result
    for index, location in ipairs(Server.locations) do
        if location.name == oldName then
            location.name = newName
            result = { index = index, data = location }
            break
        end
    end

    if not result then
        print('[DMT] ^1 Error while trying to rename location. Location not found!^7')
        return nil
    end

    updateFileData('shared/data', 'locations', Server.locations)
    return result
end)