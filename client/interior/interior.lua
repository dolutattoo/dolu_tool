RegisterNUICallback('dmt:toggleInteriorsDraw', function(data, cb)
	local success = false
	local options = {}

	for _, v in pairs(data.value) do options[v] = true end

	if options.portalInfos then portalInfos = true else portalInfos = false end
	if options.portalPoly then portalPoly = true else portalPoly = false end
	if options.portalLines then portalLines = true else portalLines = false end
	if options.portalCorners then portalCorners = true else portalCorners = false end

	cb({success})
end)