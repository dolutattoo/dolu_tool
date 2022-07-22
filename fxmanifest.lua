fx_version "cerulean"
game "gta5"
lua54 'yes'

shared_script "shared/utils.lua"

client_scripts {
	"client/utils.lua",
	"client/client.lua",
	"client/nui.lua",
	"client/noclip.lua",
	"client/interior/interior.lua",
	"client/interior/func.lua",
	"client/interior/threads.lua"
}

server_script "server/**/*"

ui_page 'web/build/index.html'

files {
  'web/build/index.html',
  'web/build/**/*'
}