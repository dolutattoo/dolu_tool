local function getFileData(path, file)
    local func, err = load(LoadResourceFile(GetCurrentResourceName(), path .. '/' .. file .. '.lua'), file, 't')
    assert(func, err == nil or '\n^1' .. err .. '^7')
    return func()
end

lib.callback.register('dmt:getPlayerLocations', function()
    return getFileData('data', 'locations')
end)

lib.callback.register('dmt:renameLocation', function(source, oldName, newName)
    local file = getFileData('data', 'locations')
    local result
    for k, v in ipairs(file) do
        print('test:', v.name, oldName)
        if v.name == oldName then
            v.name = newName
            result = { index = k, data = v }
            break
        end
    end

    if not result then
        print('[DMT] ^1 Error while trying to rename location. Location not found!^7')
        return nil
    end

    return result
end)