local function getFileData(path, file)
    return json.decode(LoadResourceFile(RESOURCE_NAME, path .. '/' .. file .. '.json'))
end

local function updateFileData(path, file, data)
    return SaveResourceFile(RESOURCE_NAME, path .. '/' .. file, json.encode(data, { indent=true }))
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
        local customLocations = getFileData('shared/data', 'locations')
        local locations = formatVanillaLocations(getFileData('shared/data', 'mloInteriors'))

        -- Set last location if not exist
        local lastLocationFound = false
        for _, v in ipairs(customLocations) do
            if v.isLastLocationUsed then
                lastLocationFound = true
            end
        end
        if not lastLocationFound then
            customLocations[1].isLastLocationUsed = true
        end

        -- Merge locations
        for _, v in ipairs(customLocations) do
            v.custom = true
            -- locations[#locations+1] = v
            table.insert(locations, v)
        end

        Server.locations = locations
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

    local success = updateFileData('shared/data', 'locations.json', Server.locations.custom)
    if not success then
        print("^2[DoluMappingTool] ^1ERROR: unable to update 'shared/data/locations.json' file.")
    end
    return result
end)

lib.callback.register('dmt:createCustomLocation', function(source, data)
    -- Remove previous 'isLastLocationUsed'
    for _, location in ipairs(Server.locations) do
        if location.isLastLocationUsed then
            location.isLastLocationUsed = nil
            break
        end
    end

    -- Format new location
    local newLocation = {
        name = data.name,
        x = math.round(data.coords.x, 3),
        y = math.round(data.coords.y, 3),
        z = math.round(data.coords.z, 3),
        heading = math.round(data.heading, 3),
        isLastLocationUsed = true,
        custom = true
    }

    -- Register new location at index 1
    table.insert(Server.locations, 1, newLocation)

    -- Create new table with custom locations only
    local customLocations = {}
    for _, v in ipairs(Server.locations) do
        if v.custom then
            customLocations[#customLocations+1] = v
        end
    end

    -- Update custom locations json file with previous table
    updateFileData('shared/data', 'locations.json', customLocations)

    return newLocation
end)

lib.callback.register('dmt:getPedList', function()
    if not Server.pedLists then
        Server.pedLists = getFileData('shared/data', 'pedList.json')
    end
    return Server.pedLists
end)