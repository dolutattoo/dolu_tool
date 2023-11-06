-- Please read documentation: https://dolutattoo.github.io/docs/category/dolu_tool
Config = {}

-- Make sure to check available languages in 'locales' folder.
-- Please contribute by creating a locale file in your language and PR on github or post it on Dolu's Discord <3.
Config.language = 'en'

-- These are default keys to interact with dolu_tool commands.
-- You can also override them in your pause menu, at the very bottom of FiveM keybinds section.
Config.openMenuKey = 'F3'
Config.toggleNoclipKey = 'F11'
Config.teleportMarkerKey = 'F10'

Config.favoriteVehicle = 'adder'

-- Use this function to check if a player is allowed to use dolu_tool features.
-- By default, the function returns true, meaning everyone can use dolu_tool.
-- 'type' can be 'menu', 'noclip', 'teleport' or 'target'
Config.permission = function(type)
    return true
end
