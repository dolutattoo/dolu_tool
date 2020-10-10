noClip = false
showInfo = false
portalPoly = false
portalInfos = false
portalLines = false
portalCorners = false
coordsOverMap = false

interiorsData = {}

objectData = {}

local checkBox = {
    noClip = false,
    mloInfos = false,
    portalPoly = false,
    portalInfos = false,
    portalLines = false,
    portalCorners = false,
    coordsOverMap = false
}

local customCoords = { 0.0, 0.0, 0.0 }

local settings = {
    timeCycle = 1,
    hour = 0,
    weather = 1,
    interior = 1,
    myInterior = 1
}

RMenu.Add('DMT', 'main', RageUI.CreateMenu("DMT", "~b~∑ DoluTattoo Mapping Tool"))
RMenu.Add('DMT', 'submenu', RageUI.CreateSubMenu(RMenu:Get('DMT', 'main'), "RageUI", "~b~DoluTattoo Mapping Tool", nil, nil, "root_cause", "shopui_title_dynasty8"))

RMenu.Add('DMT', 'timecycles', RageUI.CreateSubMenu(RMenu:Get('DMT', 'main'), "DMT", "~b~Timecycles Menu"))
RMenu.Add('DMT', 'portals', RageUI.CreateSubMenu(RMenu:Get('DMT', 'main'), "DMT", "~b~Portals Menu"))
RMenu.Add('DMT', 'rooms', RageUI.CreateSubMenu(RMenu:Get('DMT', 'main'), "DMT", "~b~Rooms Menu"))
RMenu.Add('DMT', 'entitysets', RageUI.CreateSubMenu(RMenu:Get('DMT', 'main'), "DMT", "~b~EntitySets Menu"))
RMenu.Add('DMT', 'teleport', RageUI.CreateSubMenu(RMenu:Get('DMT', 'main'), "DMT", "~b~Teleport Menu"))
RMenu.Add('DMT', 'world', RageUI.CreateSubMenu(RMenu:Get('DMT', 'main'), "DMT", "~b~World Menu"))
RMenu.Add('DMT', 'object', RageUI.CreateSubMenu(RMenu:Get('DMT', 'main'), "DMT", "~b~Object Menu"))
RMenu.Add('DMT', 'interior_menu', RageUI.CreateSubMenu(RMenu:Get('DMT', 'teleport'), "DMT", "~b~Interior Menu"))
RMenu.Add('DMT', 'interior_list', RageUI.CreateSubMenu(RMenu:Get('DMT', 'interior_menu'), "DMT", "~b~Interiors GTAV list"))
RMenu.Add('DMT', 'myinterior_list', RageUI.CreateSubMenu(RMenu:Get('DMT', 'teleport'), "DMT", "~b~Saved Location"))


RageUI.CreateWhile(1.0, RMenu:Get('DMT', 'main'), DMT.openUI, function()

    -- Global menu
    RageUI.IsVisible(RMenu:Get('DMT', 'main'), true, true, true, function()

        RageUI.Checkbox(i18n.get("noclip"), "~m~" .. i18n.get("show_interior"), checkBox.noClip, { Style = RageUI.CheckboxStyle.Tick }, function(Hovered, Selected, Active, Checked)
            checkBox.noClip = Checked
        end, function()
            noClip = true
        end, function()
            noClip = false
            FUNC.resetNoClip()
        end)
        
        RageUI.Checkbox(i18n.get("mlo_info"), "~m~" .. i18n.get("show_interior"), checkBox.mloInfos, { Style = RageUI.CheckboxStyle.Tick }, function(Hovered, Selected, Active, Checked)
            checkBox.mloInfos = Checked
        end, function()
            showInfo = true
        end, function()
            showInfo = false
        end)

        RageUI.Button(i18n.get("timecycle_menu"), "~m~" .. i18n.get("timecycle_room"), true, function()
        end, RMenu:Get('DMT', 'timecycles'))
        
        RageUI.Button(i18n.get("portal_menu"), "~m~" .. i18n.get("inter_portals"), true, function()
        end, RMenu:Get('DMT', 'portals'))

        RageUI.Button(i18n.get("room_menu"), "~m~" .. i18n.get("inter_door"), true, function()
        end, RMenu:Get('DMT', 'rooms'))

        RageUI.Button(i18n.get("entitysets_menu"), "~m~" .. i18n.get("inter_entitysets"), true, function()
        end, RMenu:Get('DMT', 'entitysets'))

        RageUI.Button(i18n.get("teleport_menu"), "~m~" .. i18n.get("needed_tp"), true, function()
        end, RMenu:Get('DMT', 'teleport'))

        RageUI.Button(i18n.get("world_menu"), "~m~" .. i18n.get("inter_world"), true, function()
        end, RMenu:Get('DMT', 'world'))

        RageUI.Button(i18n.get("object_menu"), "~m~" .. i18n.get("object_world"), true, function()
        end, RMenu:Get('DMT', 'object'))
    end)

    -- Timecycle
    RageUI.IsVisible(RMenu:Get('DMT', 'timecycles'), true, true, true, function()

        RageUI.List(i18n.get("set_timecycle"), timeCycle, settings.timeCycle, "~m~" .. i18n.get("select_timecycle"), {}, true, function(Hovered, Active, Selected, Index)
            settings.timeCycle = Index;
        end, function(Index, CurrentItems)
            FUNC.setTimecycle(timeCycle[Index].value)
        end)

        RageUI.Button(i18n.get("set_timecycle_byname"), "~m~" .. i18n.get("type_timecycle"), true, function(Hovered, Active, Selected)
           if (Selected) then
                local inputData = FUNC.displayKeyboard()
                local founded = false
                if(inputData ~= nil) then
                    for _, value in pairs(timeCycle) do
                        if(string.lower(inputData) == string.lower(value.Name)) then
                            founded = true
                            FUNC.setTimecycle(value.Name)
                            RageUI.Text({
                                message = "~b~ " .. i18n.get("current_timecycle") .. " ~w~" .. value.Name
                            })
                        end
                    end

                    if(not founded) then
                        RageUI.Text({
                            message = "~w~ " .. inputData .. " ~r~" .. i18n.get("not_exist")
                        })
                    end
                end
	        end
	    end)

    end)

    -- Portals
    RageUI.IsVisible(RMenu:Get('DMT', 'portals'), true, true, true, function()

        RageUI.Checkbox(i18n.get("portals_show"), "~m~" .. i18n.get("portals_bluePlane"), settings.portalPoly, { Style = RageUI.CheckboxStyle.Tick }, function(Hovered, Selected, Active, Checked)
            settings.portalPoly = Checked;
        end, function()
            portalPoly = true
        end, function()
            portalPoly = false
        end)

        RageUI.Checkbox(i18n.get("portals_outline"), "~m~" .. i18n.get("portals_redLine"), settings.portalLines, { Style = RageUI.CheckboxStyle.Tick }, function(Hovered, Selected, Active, Checked)
            settings.portalLines = Checked;
        end, function()
            portalLines = true
        end, function()
            portalLines = false
        end)

        RageUI.Checkbox(i18n.get("portals_info"), "~m~Show all portal info on their own coordinates", settings.portalInfos, { Style = RageUI.CheckboxStyle.Tick }, function(Hovered, Selected, Active, Checked)
            settings.portalInfos = Checked;
        end, function()
            portalInfos = true
        end, function()
            portalInfos = false
        end)

        RageUI.Checkbox(i18n.get("portals_corners"), "~m~" .. i18n.get("portals_showcoords"), settings.portalCorners, { Style = RageUI.CheckboxStyle.Tick }, function(Hovered, Selected, Active, Checked)
            settings.portalCorners = Checked;
        end, function()
            portalCorners = true
        end, function()
            portalCorners = false
        end)
        
        RageUI.Button(i18n.get("set_portalFlag"), "~m~" .. i18n.get("set_flag"), true, function(Hovered, Active, Selected)
            if (Selected) then
                local inputData = FUNC.displayKeyboard()

                if(inputData) then
                    local explode = FUNC.stringSplit(inputData, " ")

                    if(#explode == 2) then
                        FUNC.setPortalFlag(explode[1], explode[2])
                    end
                end
	        end
	    end)
    end)

    -- Rooms
    RageUI.IsVisible(RMenu:Get('DMT', 'rooms'), true, true, true, function()

        RageUI.Button(i18n.get("set_room_flag"), "~m~" .. i18n.get("set_room_newflag"), true, function(Hovered, Active, Selected)
	        if (Selected) then    
                local inputData = FUNC.displayKeyboard()
                if(inputData ~= nil) then
                   FUNC.setRoomFlag(inputData)
                end
	        end
	    end)

    end)

    -- EntitySets
    RageUI.IsVisible(RMenu:Get('DMT', 'entitysets'), true, true, true, function()

	    RageUI.Button(i18n.get("enable_entitysets"), "~m~" .. i18n.get("ac_entitysets"), true, function(Hovered, Active, Selected)
           	if (Selected) then
                local inputData = FUNC.displayKeyboard()
                if(inputData ~= nil) then
                    FUNC.enableEntitySet(inputData)
                end
	        end
	    end)

		RageUI.Button(i18n.get("toggle_last_entitysets"), "~m~" .. i18n.get("toggle_last_entitysets_info"), true, function(Hovered, Active, Selected)
           	if (Selected) then
           		FUNC.toggleLastEntitySet()
	       	end
	    end)

    end)

    -- Teleport
    RageUI.IsVisible(RMenu:Get('DMT', 'teleport'), true, true, true, function()

        RageUI.Button(i18n.get("myinterior_list"), "~m~" .. i18n.get("desc_myinterior_list"), true, function()
        end, RMenu:Get('DMT', 'myinterior_list'))

        RageUI.Button(i18n.get("tp_marker"), "~m~" .. i18n.get("tp_to_marker"), true, function(Hovered, Active, Selected)
	        if (Selected) then
	            FUNC.teleportToMarker()
	        end
	    end)

        RageUI.Button(i18n.get("tp_interior"), "~m~" .. i18n.get("inter_interior"), true, function()
        end, RMenu:Get('DMT', 'interior_menu'))

        RageUI.Button(i18n.get("custom_coords"), "~m~" .. i18n.get("set_custom_coords"), true, function(Hovered, Active, Selected)
            if (Selected) then
                local inputData = FUNC.displayKeyboard()

                if(inputData) then
                    local explode = FUNC.stringSplit(inputData, " ")
                    if(#explode == 3) then

                        for key, value in pairs(explode) do
                            customCoords[key] = value
                        end

                        RageUI.Text({
                            message = i18n.get("coords_set") .. " vector3(" .. customCoords[1] .. ", " .. customCoords[2] .. ", " .. customCoords[3] .. ")"
                        })
                    end
                end
            end
        end)

        RageUI.ButtonWithStyle(i18n.get("go_to") .. " [" .. customCoords[1] .. ", " .. customCoords[2] .. ", " .. customCoords[3] .. "]", "~m~" .. i18n.get("tp_custom_coords"), { RightBadge = RageUI.BadgeStyle.Tick }, true, function(Hovered, Active, Selected)
            if (Selected) then
                FUNC.teleportToCoords(customCoords)
            end
        end)

    end)

    RageUI.IsVisible(RMenu:Get('DMT', 'interior_menu'), true, true, true, function()
        RageUI.Button(i18n.get("interior_list"), "~m~" .. i18n.get("desc_interior_list"), true, function()
        end, RMenu:Get('DMT', 'interior_list'))
    end)

    RageUI.IsVisible(RMenu:Get('DMT', 'interior_list'), true, true, true, function()
        RageUI.List(i18n.get("set_interior"), interiorsList, settings.interior, "~m~" .. i18n.get("desc_interior_list"), {}, true, function(Hovered, Active, Selected, Index)
            settings.interior = Index;
        end, function(Index, CurrentItems)
            FUNC.teleportToCoords(interiorsList[Index].value)
        end)
    end)

    RageUI.IsVisible(RMenu:Get('DMT', 'myinterior_list'), true, true, true, function()
        if(#interiorsData >= 1) then
            RageUI.List(i18n.get("set_interior"), interiorsData, settings.myInterior, "~m~" .. i18n.get("desc_interior_list"), {}, true, function(Hovered, Active, Selected, Index)
                settings.myInterior = Index;
            end, function(Index, CurrentItems)
                FUNC.teleportToCoords(vector3(interiorsData[Index].value.x, interiorsData[Index].value.y, interiorsData[Index].value.z))
            end)
        else
            RageUI.List(i18n.get("set_interior"), {Name = "none", value = 0}, settings.interior, "~m~" .. i18n.get("desc_interior_list"), {}, true, function()
            end)
        end

        RageUI.Button(i18n.get("add_interior"), "~m~" .. i18n.get("desc_add_interior"), true, function(Hovered, Active, Selected)
            if (Selected) then
                local inputName = FUNC.displayKeyboard("Interior name")
                local playerPed = PlayerPedId()
                local playerCoords = GetEntityCoords(playerPed)
                table.insert(interiorsData, { Name = inputName, value = { x = playerCoords.x, y = playerCoords.y, z = playerCoords.z }})
                FUNC.saveInteriors(interiorsData)
	        end
	    end)
    end)
    -- World
    RageUI.IsVisible(RMenu:Get('DMT', 'world'), true, true, true, function()

        RageUI.Slider(i18n.get("time"), settings.hour, 23, "~m~" .. i18n.get("set_time_day"), false, {}, true, function(Hovered, Selected, Active, Index)
            
            if(Index > 23) then
                settings.hour = 0
            elseif(Index < 0) then
                settings.hour = 23
            else
                settings.hour = Index
            end
            
            FUNC.setClockTime(settings.hour)
            RageUI.Text({
                message = string.format(i18n.get("time_set") .. " ~b~" .. settings.hour .. ":00")
            })
        end)

        RageUI.List(i18n.get("weather"), weather, settings.weather, "~m~" .. i18n.get("select_weather"), {}, true, function(Hovered, Active, Selected, Index)
            settings.weather = Index;
        end, function(Index, CurrentItems)
            FUNC.setWeather(weather[Index].value)
            RageUI.Text({
                message = string.format("~b~" .. i18n.get("current_weather") .. ": ~w~" .. weather[Index].Name)
            })

        end)

	    RageUI.Checkbox("Show coords", "~m~Show current position over the minimap", settings.coordsOverMap, { Style = RageUI.CheckboxStyle.Tick }, function(Hovered, Selected, Active, Checked)
            settings.coordsOverMap = Checked;
        end, function()
            coordsOverMap = true
        end, function()
            coordsOverMap = false
        end)
    end)

    -- Object
    RageUI.IsVisible(RMenu:Get('DMT', 'object'), true, true, true, function()

        RageUI.Button(i18n.get("create_object"), "~m~" .. i18n.get("desc_create_object"), true, function(Hovered, Active, Selected)
            if (Selected) then
                local inputData = FUNC.displayKeyboard()
                local playerCoords = GetEntityCoords(PlayerPedId())

                if(inputData) then
                    local explode = FUNC.stringSplit(inputData, " ")
                    if(#explode == 1) then

                        local model = GetHashKey(explode[1])
                        local found = true
                        local count = 0

                        while not HasModelLoaded(model) do
                            RequestModel(model)
                            Wait(1)
                            if(count > 1000) then
                                found = false
                                break
                            end
                            count = count + 1
                        end

                        if(found) then
                            local obj = CreateObject(model, playerCoords.x, playerCoords.y, playerCoords.z-1, true, false, false)
                            FreezeEntityPosition(obj, true)

                            table.insert(objectData, { obj = obj, name = model, coords = GetEntityCoords(obj) })
                        else
                            RageUI.Text({
                                message = i18n.get("object_not_found")
                            })
                        end
                    end
                end
            end
        end)

        RageUI.Button(i18n.get("delete_object"), "~m~" .. i18n.get("desc_delete_object"), true, function(Hovered, Active, Selected)
            if (Selected) then
                local playerCoords = GetEntityCoords(PlayerPedId())

                for i=1, #objectData do
                    local obj = GetClosestObjectOfType(playerCoords.x, playerCoords.y, playerCoords.z , 2.0, objectData[i].name, true, true, true)

                    if(obj ~= nil) then
                        if(GetEntityCoords(obj) == objectData[i].coords) then
                            if(#(playerCoords - GetEntityCoords(obj)) < 3.0) then
                            objectData[i] = nil
                            DeleteEntity(obj)
                            end
                        end
                    end
                end
            end
        end)
    end)
end)
