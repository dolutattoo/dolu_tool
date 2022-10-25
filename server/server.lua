local function getXmlFile(path, file)
    local xml = LoadResourceFile(RESOURCE_NAME, path .. '/' .. file)
    return exports[RESOURCE_NAME]:xmlToTable(xml)
end

local function getFileData(path, file)
    return json.decode(LoadResourceFile(RESOURCE_NAME, path .. '/' .. file))
end

local function updateFileData(path, file, data)
    return SaveResourceFile(RESOURCE_NAME, path .. '/' .. file, json.encode(data, { indent=true }))
end

local function formatVanillaInteriors(vanillaInteriors)
    local formatedLocations = {}
    local count = 0

    for i=1, #vanillaInteriors do
        local v = vanillaInteriors[i]
        if v.Locations[1] then
            count += 1
            formatedLocations[count] = {
                name = v.Name,
                x = math.floor(v.Locations[1].Position.X *10^2)/10^2,
                y = math.floor(v.Locations[1].Position.Y *10^2)/10^2,
                z = math.floor(v.Locations[1].Position.Z *10^2)/10^2,
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

local function filterCustomLocations()
    -- Filter custom locations to update 'locations.json'
    local customLocations = {}
    for _, v in ipairs(Server.locations) do
        if v.custom then
            customLocations[#customLocations+1] = v
        end
    end
    return customLocations
end

lib.callback.register('dmt:getLocations', function()
    if not Server.locations then
        local customLocations = getFileData('shared/data', 'locations.json')
        local locations = formatVanillaInteriors(getFileData('shared/data', 'mloInteriors.json'))

        -- Merge locations
        for _, v in ipairs(customLocations) do
            v.custom = true
            table.insert(locations, v)
        end

        Server.locations = locations
    end
    return Server.locations
end)

lib.callback.register('dmt:renameLocation', function(source, data)
    local result

    for index, location in ipairs(Server.locations) do
        if location.custom and location.name == data.oldName then
            location.name = data.newName
            result = { index = index, data = location }
        end
    end
    assert(result ~= nil, "Error while trying to rename location. Location not found!")

    local success = updateFileData('shared/data', 'locations.json', filterCustomLocations())
    assert(success == true, "Unable to update 'shared/data/locations.json' file.")

    return result
end)

lib.callback.register('dmt:createCustomLocation', function(source, data)
    local newLocation = {
        name = data.name,
        x = math.round(data.coords.x, 3),
        y = math.round(data.coords.y, 3),
        z = math.round(data.coords.z, 3),
        heading = math.round(data.heading, 3),
        custom = true
    }

    -- Register new location at index 1
    table.insert(Server.locations, 1, newLocation)

    local success = updateFileData('shared/data', 'locations.json', filterCustomLocations())
    assert(success == true, "Unable to update 'shared/data/locations.json' file.")

    return newLocation
end)

lib.callback.register('dmt:deleteLocation', function(source, data)
    local foundIndex
    for k, v in ipairs(Server.locations) do
        if v.custom and v.name == data then
            foundIndex = k
            print("Name of location to delete:", v.name, "Index of location to delete:", k)
            break
        end
    end
    if not foundIndex then return false end

    table.remove(Server.locations, foundIndex)

    local success = updateFileData('shared/data', 'locations.json', filterCustomLocations())
    assert(success == true, "Unable to update 'shared/data/locations.json' file.")
    print("Index of location deleted:", foundIndex)
    return foundIndex
end)

lib.callback.register('dmt:getPedList', function()
    if not Server.pedLists then
        Server.pedLists = getFileData('shared/data', 'pedList.json')
    end
    return Server.pedLists
end)

lib.callback.register('dmt:getVehicleList', function()
    if not Server.vehicleLists then
        Server.vehicleLists = getFileData('shared/data', 'vehicleList.json')
    end
    return Server.vehicleLists
end)

RegisterCommand('xml', function()
    local data = getXmlFile('shared/data/ymap', 'test.ymap.xml')
    local entities = data.CMapData.entities

    for k, v in pairs(entities[1].Item) do
        print(v.archetypeName[1])
    end
end)

lib.callback.register('dmt:getYmapEntities', function(_, fileName)
    local xml = getXmlFile('ymap', fileName..'.ymap.xml')
    local entities = {}

    for _, v in pairs(xml.CMapData.entities[1].Item) do
        local isFrozen = tonumber(v.flags[1]['$'].value) == 32 and true or nil

        table.insert(entities, {
            name = v.archetypeName[1],
            position = {
                x = tonumber(v.position[1]['$'].x),
                y = tonumber(v.position[1]['$'].y),
                z = tonumber(v.position[1]['$'].z)
            },
            rotation = {
                x = tonumber(v.rotation[1]['$'].x),
                y = tonumber(v.rotation[1]['$'].y),
                z = tonumber(v.rotation[1]['$'].z),
                w = tonumber(v.rotation[1]['$'].w)
            },
            frozen = isFrozen
        })
    end

    return entities
end)
