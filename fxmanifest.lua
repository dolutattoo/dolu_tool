fx_version "cerulean"
game "gta5"
lua54 'yes'

shared_script "shared/utils.lua"

client_scripts {
	"client/**/*.lua",
}

server_script "server/**/*"

ui_page 'web/build/index.html'

files {
  'web/build/index.html',
  'web/build/**/*'
}