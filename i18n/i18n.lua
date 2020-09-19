i18n = {}

i18n.get = function(key)
    if(key ~= nil) then
        if (i18n[DMT.locale][key] ~= nil) then
            return i18n[DMT.locale][key]
        else
            return "#translate empty " ..  key .. "#"
        end
    end
end