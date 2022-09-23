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
}

client_scripts {
    '@ox_core/imports/client.lua',
    'data/locations.lua',
    'data/targets.lua',
    'client/client.lua',
}

server_scripts {
	'@oxmysql/lib/MySQL.lua',
	'@ox_core/imports/server.lua',
	'server/server.lua'
}

ui_page 'web/build/index.html'

files {
    'web/build/index.html',
    'web/build/**/*',
}
