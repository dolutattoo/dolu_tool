--- A simple wrapper around SendNUIMessage that you can use to
--- dispatch actions to the React frame.
---
---@param action string The action you wish to target
---@param data any The data you wish to send along with this action
function SendReactMessage(action, data)
  SendNUIMessage({
    action = action,
    data = data
  })
end

local currentResourceName = GetCurrentResourceName()

local debugIsEnabled = GetConvarInt(('%s-debugMode'):format(currentResourceName), 0) == 1

--- A simple debug print function that is dependent on a convar
--- will output a nice prettfied message if debugMode is on
function debugPrint(...)
  if not debugIsEnabled then return end
  local args <const> = { ... }

  local appendStr = ''
  for _, v in ipairs(args) do
    appendStr = appendStr .. ' ' .. tostring(v)
  end
  local msgTemplate = '^3[%s]^0%s'
  local finalMsg = msgTemplate:format(currentResourceName, appendStr)
  print(finalMsg)
end


------------ GIZMO ------------

-- Convert to 64-byte number
local function enc(data)
	data = json.encode(data)
    return ((data:gsub('.', function(x)
        local r,b='',x:byte() or ''
        for i=8,1,-1 do r=r..(b%2^i-b%2^(i-1)>0 and '1' or '0') end
        return r;
    end)..'0000'):gsub('%d%d%d?%d?%d?%d?', function(x)
        if (#x < 6) then return '' end
        local c=0
        for i=1,6 do c=c+(x:sub(i,i)=='1' and 2^(6-i) or 0) end
        return b and b:sub(c+1,c+1) or ''
    end)..({ '', '==', '=' })[#data%3+1])
end

local drawGizmo = false
RegisterCommand('gizmo', function(source, args)
	drawGizmo = not drawGizmo
end)

CreateThread(function()
	while true do
		local cam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true)
		if drawGizmo then
			local playerPed = PlayerPedId()

			local right, forward, up, at = GetEntityMatrix(playerPed)
			if printed then
				printed = not printed
				print('-----\nforwardVector:', right, '\nrightVector:', forward, '\nupVector:', up, '\nposition:', at, '\n-----')
			end

			local data = { right.x, right.y, right.z, forward.x, forward.y, forward.z, up.x, up.y, up.z, at.x, at.y, at.z }
			DrawGizmo(enc(data), 'test')
		end
		Wait(0)
	end
end)