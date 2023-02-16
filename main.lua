if Config.Framework == 'Standalone' then
    lib.callback.register('dolu_tool:StandalonePErmsCheckingForEasyType', function(source)
        --return 1
        -- If you want everyone here is a small one you can use

        local GetPlayerIdentifiers = GetPlayerIdentifiers
        local steamid  = false
        local license  = false
        local discord  = false
        local ip       = false

        local Admin_List = {
            {
                admin_name = 'Admin 1', -- just for you to know who it is
                admin_steamid = '', -- Admin steamid ('steam:wadwad') or leave it as ''
                admin_license = 'license:35c3e0b83865a6cd535bf1d8bf6b8cdff59ae12a', -- Admin license ('license:wdadaw') or leave it as ''
                admin_discord = '', -- Admin discord (discord:wadawda) or leave it as ''
                admin_ip = '', -- Admin ip (ip:wdada) or leave it as ''
            }
        }

        -- Finds the players identifier
        for k,v in pairs(GetPlayerIdentifiers(source))do
            if string.sub(v, 1, string.len("steam:")) == "steam:" then
                steamid = v
            elseif string.sub(v, 1, string.len("license:")) == "license:" then
                license = v
            elseif string.sub(v, 1, string.len("ip:")) == "ip:" then
                ip = v
            elseif string.sub(v, 1, string.len("discord:")) == "discord:" then
                discord = v
            end
        end

        -- wait to make it collect everything
        Wait(50)
        print(license)
        for k,v in ipairs(Admin_List) do
            if 
                v.admin_steamid ~= '' and v.admin_steamdid == steamid or 
                v.admin_license ~= '' and v.admin_license == license or 
                v.admin_discord ~= '' and v.admin_discord == discord or
                v.admin_ip ~= '' and v.admin_ip == ip
            then
                return 1
            else
                return 0
            end
        end
    end)
end

local function getFileData(path, file)
    return json.decode(LoadResourceFile(RESOURCE_NAME, path .. '/' .. file))
end

local function updateFileData(path, file, data)
    return SaveResourceFile(RESOURCE_NAME, path .. '/' .. file, json.encode(data, { indent=true }))
end

local function formatTimecycles(timecycles)
    local formatedTimecycles = {}

    for i=1, #timecycles do
        local v = timecycles[i]
        table.insert(formatedTimecycles, { label = v.Name, value = tostring(joaat(v.Name)) })
    end

    return formatedTimecycles
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

local function formatRadioStations(radioStations)
    local formatedRadioStations = {}

    for i=1, #radioStations do
        local v = radioStations[i]
        table.insert(formatedRadioStations, { label = v.RadioName, value = v.RadioName })
    end

    return formatedRadioStations
end

local function formatStaticEmitters(staticEmitters)
    local formatedStaticEmitters = {}

    for i=1, #staticEmitters do
        local v = staticEmitters[i]
        table.insert(formatedStaticEmitters, {
            name = v.Name,
            coords = vec3(v.Position.X, v.Position.Y, v.Position.Z),
            flags = v.Flags,
            interior = v.Interior,
            room = v.Room,
            radiostation = v.RadioStation
        })
    end

    return formatedStaticEmitters
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

lib.callback.register('dolu_tool:getData', function()
    local data = {}
    
    local customLocations = getFileData('shared/data', 'locations.json')
    local locations = formatVanillaInteriors(getFileData('shared/data', 'mloInteriors.json'))
    for _, v in ipairs(customLocations) do
        v.custom = true
        table.insert(locations, v)
    end
    Server.locations = locations

    return {
        locations = locations,
        peds = getFileData('shared/data', 'pedList.json'),
        vehicles = getFileData('shared/data', 'vehicleList.json'),
        weapons = getFileData('shared/data', 'weaponList.json'),
        timecycles = formatTimecycles(getFileData('shared/data', 'timecycleModifiers.json')),
        staticEmitters = formatStaticEmitters(getFileData('shared/data', 'staticEmitters.json')),
        radioStations = formatRadioStations(getFileData('shared/data', 'radioStations.json'))
    }
end)

lib.callback.register('dolu_tool:renameLocation', function(source, data)
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

lib.callback.register('dolu_tool:createCustomLocation', function(source, data)
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

lib.callback.register('dolu_tool:deleteLocation', function(source, data)
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

if Shared.ox_inventory then
    local function getAmmo(weaponName)
        local file = ('data/%s.lua'):format('weapons')
        local datafile = LoadResourceFile('ox_inventory', file)
        local path = ('@@%s/%s'):format('ox_inventory', file)

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

    lib.callback.register('dolu_tool:giveWeaponToPlayer', function(source, weaponName)
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

RegisterCommand('flag', function(source, args)
    if source > 0 then return end

    local totalFlags = tonumber(args[1])
    local type = 'ytyp'
    local all_flags = { 
        portal = { 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192 },
        room = { 1, 2, 4, 8, 16, 32, 64, 128, 256, 512 },
        ytyp = { 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648 }
    }
    
    if not all_flags[type] then return end
    
    local flags = {}
    for _, flag in ipairs(all_flags[type]) do
        if totalFlags & flag ~= 0 then
            flags[#flags+1] = tostring(flag)
        end
    end

    local result = {}
    for i, flag in ipairs(flags) do
        result[#result+1] = tostring(flag)
    end

    print(json.encode(result , {indent=true}))
end)

ESX.RegisterServerCallback('dolu_tool:CheckPlayerForIsAdmin', function(source, cb)
	local xPlayer = ESX.GetPlayerFromId(source)
	if xPlayer.getGroup() == 'admin' then
        cb(1)
    else
        cb(0)
    end
end)