local floor = math.floor
local vector3 = vector3
local SetCamRot = SetCamRot
local IsCamActive = IsCamActive
local SetCamCoord = SetCamCoord
local PinInteriorInMemory = PinInteriorInMemory
local SetFocusPosAndVel = SetFocusPosAndVel
local LockMinimapAngle = LockMinimapAngle
local GetInteriorAtCoords = GetInteriorAtCoords
local LockMinimapPosition = LockMinimapPosition

local _internal_camera = nil
local _internal_isFrozen = false

local _internal_pos = nil
local _internal_rot = nil
local _internal_vecX = nil
local _internal_vecY = nil
local _internal_vecZ = nil

--------------------------------------------------------------------------------

local function GetInitialCameraPosition()
    if _G.CAMERA_SETTINGS.KEEP_POSITION and _internal_pos then
        return _internal_pos
    end

    return GetGameplayCamCoord()
end

local function GetInitialCameraRotation()
    if _G.CAMERA_SETTINGS.KEEP_ROTATION and _internal_rot then
        return _internal_rot
    end

    local rot = GetGameplayCamRot()
    return vector3(rot.x, 0.0, rot.z)
end

--------------------------------------------------------------------------------

function IsFreecamFrozen()
    return _internal_isFrozen
end

--------------------------------------------------------------------------------

function GetFreecamPosition()
    return _internal_pos
end

function SetFreecamPosition(pos)
    local int = GetInteriorAtCoords(pos.x, pos.y, pos.z)

    if int ~= 0 then
        PinInteriorInMemory(int)
    end

    SetFocusPosAndVel(pos.x, pos.y, pos.z)
    LockMinimapPosition(pos.x, pos.y)
    SetCamCoord(_internal_camera, pos.x, pos.y, pos.z)

    _internal_pos = pos
end

--------------------------------------------------------------------------------

function GetFreecamRotation()
    return _internal_rot
end

function SetFreecamRotation(rot)
    rot = vector3(Clamp(rot.x, -90.0, 90.0), rot.y % 360, rot.z % 360)

    if _internal_rot ~= rot then
        local vecX, vecY, vecZ = EulerToMatrix(rot.x, rot.y, rot.z)

        LockMinimapAngle(floor(rot.z))
        SetCamRot(_internal_camera, rot.x, rot.y, rot.z)

        _internal_rot  = rot
        _internal_vecX = vecX
        _internal_vecY = vecY
        _internal_vecZ = vecZ
    end
end

--------------------------------------------------------------------------------

local function SetFreecamFov(fov)
    fov = Clamp(fov, 0.0, 90.0)
    SetCamFov(_internal_camera, fov)
end

--------------------------------------------------------------------------------

function GetFreecamMatrix()
    return _internal_vecX,
    _internal_vecY,
    _internal_vecZ,
    _internal_pos
end

--------------------------------------------------------------------------------

function IsFreecamActive()
    return IsCamActive(_internal_camera)
end

function SetFreecamActive(active)
    if active == IsFreecamActive() then
        return
    end

    local ped = cache.ped

    SetEntityVisible(ped, not active)
    SetEntityCollision(ped, not active, not active)
    SetEntityCompletelyDisableCollision(ped, not active, not active)
    SetEntityInvincible(ped, active)

    local enableEasing = _G.CAMERA_SETTINGS.ENABLE_EASING
    local easingDuration = _G.CAMERA_SETTINGS.EASING_DURATION

    if active then
        if cache.vehicle then
            TaskLeaveVehicle(ped, cache.vehicle, 16)
        end

        _internal_camera = CreateCam('DEFAULT_SCRIPTED_CAMERA', true)

        SetFreecamFov(_G.CAMERA_SETTINGS.FOV)
        SetFreecamPosition(GetInitialCameraPosition())
        SetFreecamRotation(GetInitialCameraRotation())
        TriggerEvent('freecam:onEnter')
        StartFreecamThread()
    else
        DestroyCam(_internal_camera)
        ClearFocus()
        UnlockMinimapPosition()
        UnlockMinimapAngle()
        TriggerEvent('freecam:onExit')
        SetGameplayCamRelativeHeading(0)
    end

    RenderScriptCams(active, enableEasing, easingDuration, true, true)
end

function setGameplayCamCoords(coords)
    SetCamCoord(_internal_camera, coords.x, coords.y, coords.z)
    SetFreecamPosition(vec3(coords.x, coords.y, coords.z))
end