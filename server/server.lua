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
            break
        end
    end
    if not foundIndex then return false end

    table.remove(Server.locations, foundIndex)

    local success = updateFileData('shared/data', 'locations.json', filterCustomLocations())
    assert(success == true, "Unable to update 'shared/data/locations.json' file.")
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

lib.callback.register('dmt:getWeaponList', function()
    if not Server.weaponLists then
        Server.weaponLists = getFileData('shared/data', 'weaponList.json')
    end
    return Server.weaponLists
end)

if Shared.ox_inventory then
    local function getAmmo(weaponName)
        local file = ('data/%s.lua'):format('weapons')
        local datafile = LoadResourceFile("ox_inventory", file)
        local path = ('@@%s/%s'):format("ox_inventory", file)

        if not datafile then
            warn(('no datafile found at path %s'):format(path:gsub('@@', '')))
            return {}
        end

        local func, err = load(datafile, path)

        if not func or err then
            return error(err, 0)
        end

        return func().Weapons[weaponName:upper()].ammoname
    end

    lib.callback.register('dmt:giveWeaponToPlayer', function(source, weaponName)
        local success = false

        local ammoName = getAmmo(weaponName)

        if exports.ox_inventory:CanCarryItem(source, weaponName, 1) then
            exports.ox_inventory:AddItem(source, weaponName, 1, { ammo = 100 })
            success = true

            if exports.ox_inventory:CanCarryItem(source, ammoName, 1) then
                local ammoCount = exports.ox_inventory:Search(source, 'count', ammoName)
                if ammoCount < 100 then
                    exports.ox_inventory:AddItem(source, ammoName, 100 - ammoCount)
                end
            end
        end
        
        return success
    end)
end