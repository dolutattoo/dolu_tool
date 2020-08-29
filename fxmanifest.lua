fx_version 'adamant'
games { 'gta5' };

name 'DoluMappingTool_v2';

description 'Here is the first version of my mapping tool. This is only to help modders to create interiors mods (MLO). Do not hesitate to contribute to this project on my github.'
description 'If you like the tool, you can donate here https://paypal.me/DoluTattoo'

client_scripts {
    "src/client/RMenu.lua",
    "src/client/menu/RageUI.lua",
    "src/client/menu/Menu.lua",
    "src/client/menu/MenuController.lua",
    "src/client/components/*.lua",
    "src/client/menu/elements/*.lua",
    "src/client/menu/items/*.lua",
    "src/client/menu/panels/*.lua",
    "src/client/menu/windows/*.lua",

}

client_scripts {
     'dolutattoo/dolu_mapping_tool.lua'
}


