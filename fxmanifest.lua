--[[ FX Information ]]--
fx_version   'cerulean'
use_experimental_fxv2_oal 'yes'
lua54        'yes'
game         'gta5'

--[[ Resource Information ]]--
name         'ox_banking'
version      '0.0.0'
description  'Banking system for ox_core'
license      'MIT'
author       'overextended'
repository   'https://github.com/overextended/ox_banking'

--[[ Manifest ]]--
dependencies {
	'/server:5104',
	'/onesync',
}

shared_scripts {
	'@ox_lib/init.lua',
    'init.lua'
}

client_scripts {
    'client/functions.lua',
    'client/client.lua',
    'client/controls.lua',
    'client/functions.lua',
    'client/interior/main.lua',
}

server_scripts {
	'server/server.lua'
}

ui_page 'web/build/index.html'

files {
    'web/build/index.html',
    'web/build/**/*',
    'shared/img/**/*.webp',
}
