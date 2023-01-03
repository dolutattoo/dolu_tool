fx_version 'cerulean'
use_experimental_fxv2_oal 'yes'
lua54 'yes'
game 'gta5'

name         'DoluMappingTool'
version      'v4'
description  'Mapping tool for map developpers'
author       'Dolu'
repository   'https://github.com/dolutattoo/DoluMappingTool'

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua',
    'shared/init.lua'
}

client_scripts {
    'client/freecam/utils.lua',
    'client/freecam/config.lua',
    'client/freecam/camera.lua',
    'client/freecam/main.lua',

    'client/functions.lua',
    'client/client.lua',
    'client/controls.lua',
    'client/commands.lua',
    'client/interior.lua',
    'client/threads.lua',

}

server_scripts {
	'server/server.lua',
	'server/xml.js'
}

ui_page 'web/build/index.html'

files {
    'web/build/index.html',
    'web/build/**/*',
    'shared/img/**/*.webp',
    'shared/img/**/*.png',
    'locales/*.json'
}

dependencies {
    '/server:5104',
    '/onesync',
    'ox_lib'
}
