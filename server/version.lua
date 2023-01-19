local currentVersion = GetResourceMetadata('dolu_tool', 'version', 0)

if currentVersion then
    currentVersion = currentVersion:match('%d%.%d+%.%d+')
end

local versionData = { currentVersion = currentVersion }

local function checkVersion()
	if not currentVersion then return print("^1Unable to determine current resource version for 'dolu_tool' ^0") end

	SetTimeout(200, function()
		PerformHttpRequest('https://api.github.com/repos/dolutattoo/dolu_tool/releases/latest', function(status, response)
			if status ~= 200 then return end

			response = json.decode(response)
			if response.prerelease then return end

			local latestVersion = response.tag_name:match('%d%.%d+%.%d+')
			if not latestVersion or latestVersion == currentVersion then return end

            local cv = { string.strsplit('.', currentVersion) }
            local lv = { string.strsplit('.', latestVersion) }

            for i = 1, #cv do
                local current, minimum = tonumber(cv[i]), tonumber(lv[i])

                if current ~= minimum then
                    if current < minimum then
                        versionData = { currentVersion = currentVersion, url = response.html_url }
                        return print(("^3An update is available for 'dolu_tool' (current version: %s)\r\n%s^0"):format(currentVersion, response.html_url))
                    else break end
                end
            end
		end, 'GET')
	end)
end

if not Config.development then
    checkVersion()
end

lib.callback.register('dolu_tool:getVersion', function()
    return versionData
end)