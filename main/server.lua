RegisterNetEvent("DMT:saveInteriors")
AddEventHandler("DMT:saveInteriors", function(array)
    SaveResourceFile(GetCurrentResourceName(), "save/interiors.json", json.encode(array), -1)
end)

RegisterNetEvent("DMT:loadInteriors")
AddEventHandler("DMT:loadInteriors", function()
    local interiorsData = json.decode(LoadResourceFile(GetCurrentResourceName(), "save/interiors.json") or "[]")
    TriggerClientEvent("DMT:initInteriors", source, interiorsData)
end)

PerformHttpRequest("https://raw.githubusercontent.com/dolutattoo/DoluMappingTool/master/version.json", function(err, text, h)
    if err == 200 then
      local versionArray = json.decode(text)
      local gitVersion = versionArray.version

      if(DMT.VERSION ~= gitVersion) then
        print("\n=================================\n")
        local patchnoteArray = versionArray.patchnote
        local patchnote = ""
        for _, line in pairs(patchnoteArray) do
          patchnote = patchnote..line.."\n"
        end

        print(replaceString("^8A new version of DoluMappingTool is available (actual version : #VALUE#, new version : #VALUE#). Check it here : https://github.com/dolutattoo/DoluMappingTool^7\n", {DMT.VERSION, gitVersion}))
        print(replaceString("^2The patchnote of this new version is :\n#VALUE#^7", {patchnote}))
        print("=================================")
      end
    else
      print(i18n.get("cant_get_version"))
    end
end, "GET")


function replaceString(str, args)
	for i=1,#args do
		str = string.gsub(str, "#VALUE#", args[i], 1)
	end

	return str
end