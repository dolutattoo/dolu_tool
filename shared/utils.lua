local isServer = IsDuplicityVersion()

function debug(msg)
	if type(msg) == 'table' then
		msg = json.encode(msg)
	end

	if isServer then
		TriggerClientEvent('printDebug', -1, msg)
		print('^5[DEBUG] '.. msg .. '^7')
	else
		TriggerServerEvent('printDebug', msg)
		print('^5[DEBUG] ' .. msg .. '^7')
	end
end

if not isServer then
	RegisterNetEvent('printDebug', function(msg)
		print('^5[DEBUG][SERVER] ' .. msg .. '^7')
	end)
else
	RegisterServerEvent('printDebug', function(msg)
		print('^5[DEBUG][CLIENT] ' .. msg .. '^7')
	end)
end