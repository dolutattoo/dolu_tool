-- Global variables
hour, minute, second, weather, freezeTime = 12, 30, 0, 'CLEAR', false

-- NUI callbacks
RegisterNUICallback('dmt:world:setTime', function(data, cb)
	if not data then print("^1[WARNING]^7 Time slider seems to be broken!") return end

	-- Updating global variables
	hour = data.hour or hour
	minute = data.minute or minute
	second = data.second or second

    FUNC.setClock(hour, minute, second)

	cb({})
end)

RegisterNUICallback('dmt:world:setWeather', function(data, cb)
	if not data then print("^1[WARNING]^7 Weather slider seems to be broken!") return end

	-- Updating global variables
	weather = data and data.weather or weather

	FUNC.setWeather(weather)

	cb({})
end)

RegisterNUICallback('dmt:world:freezeTime', function(data, cb)
	if not data then print("^1[WARNING]^7 Freeze Time checkbox seems to be broken!") return end

	-- Interacting with loop (../threads.lua) + updating related global variable
	freezeTime = data.freezeTime or freezeTime
	cb({false})
end)