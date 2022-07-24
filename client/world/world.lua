RegisterNUICallback('dmt:world:setTime', function(data, cb)
    local hours = 12
    FUNC.setClock(data.hour, data.minute, 0)
    cb({hours})
end)

RegisterNUICallback('dmt:world:setWeather', function(data, cb)
    local weather = 'clear'
    FUNC.setWeather(data.weather)
    cb({hours})
end)