RegisterServerEvent('dmt:savePositions', function(array)
  SaveResourceFile(GetCurrentResourceName(), 'shared/positions.json', json.encode(array, {indent = true}), -1)
  TriggerEvent('dmt:loadPositions')
end)

RegisterServerEvent('dmt:loadPositions', function()
  local positionsData = json.decode(LoadResourceFile(GetCurrentResourceName(), 'shared/positions.json') or '[]')
  TriggerClientEvent("dmt:initPositions", -1, positionsData)
end)