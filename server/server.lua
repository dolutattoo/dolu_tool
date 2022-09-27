local function getFileData(path, file)
    return json.decode(LoadResourceFile(RESOURCE_NAME, path .. '/' .. file .. '.json'))
end

local function updateFileData(path, file, data)
    return SaveResourceFile(RESOURCE_NAME, path .. '/' .. file .. '.json', json.encode(data, { indent=true }))
end

local function formatVanillaLocations(vanillaLocations)
    local formatedLocations = {}
    local count = 0

    for i=1, #vanillaLocations do
        local v = vanillaLocations[i]
        if v.Locations[1] then
            count += 1
            formatedLocations[count] = {
                name = v.Name,
                x = v.Locations[1].Position.X,
                y = v.Locations[1].Position.Y,
                z = v.Locations[1].Position.Z,
                heading = 0,
                metadata = {
                    dlc = v.DlcName,
                    ytyp = v.FilePath,
                    ymap = v.Locations[1].FilePath,
                    totalEntitiesCount = v.TotalEntitiesCount
                }
            }
        end
    end

    return formatedLocations
end

lib.callback.register('dmt:getLocations', function()
    if not Server.locations then
        Server.locations = {
            vanilla = formatVanillaLocations(getFileData('shared/data', 'mloInteriors')),
            custom = getFileData('shared/data', 'locations')
        }
    end
    return Server.locations
end)

lib.callback.register('dmt:renameLocation', function(source, data)
    local result
    local lastUsedFound = 0

    for index, location in ipairs(Server.locations.custom) do
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
        print('^2[DoluMappingTool] ^1 Error while trying to rename location. Location not found!^7')
        return nil
    end

    local success = updateFileData('shared/data', 'locations', Server.locations.custom)
    if not success then
        print("^2[DoluMappingTool] ^1ERROR: unable to update 'shared/data/locations.json' file.")
    end
    return result
end)

lib.callback.register('dmt:createCustomLocation', function(source, data)
    local result = {
        name = data.name,
        x = data.coords.x,
        y = data.coords.y,
        z = data.coords.z,
        heading = data.heading,
        isLastLocationUsed = true
    }

    for _, location in ipairs(Server.locations.custom) do
        if location.isLastLocationUsed then
            location.isLastLocationUsed = nil
        end
    end

    table.insert(Server.locations.custom, 1, result)

    local success = updateFileData('shared/data', 'locations', Server.locations.custom)
    if not success then
        print("^2[DoluMappingTool] ^1ERROR: unable to update 'shared/data/locations.json' file.")
    end
    return result
end)


lib.callback.register('dmt:getPedList', function()
    if not Server.pedLists then
        Server.pedLists = getFileData('shared/data', 'pedList')
    end
    return Server.pedLists
end)