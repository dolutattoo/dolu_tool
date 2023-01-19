local rad = math.rad
local sin = math.sin
local cos = math.cos
local min = math.min
local max = math.max
local type = type

function table.copy(x)
  x = table.clone(x)
  for k, v in pairs(x) do
    if type(v) == 'table' then
      x[k] = table.copy(v)
    end
  end
  return x
end

function protect(t)
  local fn = function(_, k)
    error('Key `' .. tostring(k) .. '` is not supported.')
  end

  return setmetatable(t, {
    __index = fn,
    __newindex = fn
  })
end

function CreateGamepadMetatable(keyboard, gamepad)
  return setmetatable({}, {
    __index = function(t, k)
      local src = IsGamepadControl() and gamepad or keyboard
      return src[k]
    end
  })
end

function Clamp(x, _min, _max)
  return min(max(x, _min), _max)
end

function IsGamepadControl()
  return not IsUsingKeyboard(2)
end

function GetSmartControlNormal(control)
  if type(control) == 'table' then
    local normal1 = GetDisabledControlNormal(0, control[1])
    local normal2 = GetDisabledControlNormal(0, control[2])
    return normal1 - normal2
  end

  return GetDisabledControlNormal(0, control)
end

function EulerToMatrix(rotX, rotY, rotZ)
  local radX = rad(rotX)
  local radY = rad(rotY)
  local radZ = rad(rotZ)

  local sinX = sin(radX)
  local sinY = sin(radY)
  local sinZ = sin(radZ)
  local cosX = cos(radX)
  local cosY = cos(radY)
  local cosZ = cos(radZ)

  local vecX = vector3(
    cosY * cosZ,
    cosY * sinZ,
    -sinY
  )

  local vecY = vector3(
    cosZ * sinX * sinY - cosX * sinZ,
    cosX * cosZ - sinX * sinY * sinZ,
    cosY * sinX
  )

  local vecZ = vector3(
    -cosX * cosZ * sinY + sinX * sinZ,
    -cosZ * sinX + cosX * sinY * sinZ,
    cosX * cosY
  )

  return vecX, vecY, vecZ
end
