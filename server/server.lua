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
    return SaveResourceFile(RESOURCE_NAME, path .. '/' .. file .. '.json', json.encode(data, { indent=true }))
end

lib.callback.register('dmt:getLocations', function()
    if not Server.locations then
        Server.locations = getFileData('shared/data', 'locations')
    end
    return Server.locations
end)

lib.callback.register('dmt:renameLocation', function(source, data)
    local result
    local lastUsedFound = 0
    for index, location in ipairs(Server.locations) do
        if location.isLastLocationUsed and location.name ~= data.oldName then
            location.isLastLocationUsed = nil
            lastUsedFound += 1
        end

        if location.name == data.oldName then
            location.name = data.newName
            location.isLastLocationUsed = true
            result = { index = index, data = location }
            lastUsedFound += 1
        end

        if lastUsedFound == 2 then break end
    end

    if not result then
        print('[DMT] ^1 Error while trying to rename location. Location not found!^7')
        return nil
    end

    local success = updateFileData('shared/data', 'locations', Server.locations)
    if not success then
        print("[DoluMappingTool] ^1ERROR: unable to update 'shared/data/locations.json' file.")
    end
    return result
end)