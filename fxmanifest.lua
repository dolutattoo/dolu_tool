fx_version 'adamant'
games { 'gta5' };

name 'DoluMappingTool';

description 'Here is the first version of my mapping tool. This is only to help modders to create interiors mods (MLO). Do not hesitate to contribute to this project on my github.'
description 'If you like the tool, you can donate here https://paypal.me/DoluTattoo'

client_scripts {
    "lib/RMenu.lua",
    "lib/menu/RageUI.lua",
    "lib/menu/Menu.lua",
    "lib/menu/MenuController.lua",
    "lib/components/*.lua",
    "lib/menu/elements/*.lua",
    "lib/menu/items/*.lua",
    "lib/menu/panels/*.lua",
    "lib/menu/windows/*.lua",

    "config.lua",
    "main/data/timecycle.lua",
    "main/data/weather.lua",
    "main/data/interiors.lua",

    "i18n/i18n.lua",
    "i18n/locales/en.lua",

    "main/menu.lua",
    "main/func.lua",
    "main/threads.lua"
}

server_scripts {
    "i18n/i18n.lua",
    "i18n/locales/en.lua",
    
    "main/server.lua",
    "config.lua",
}
