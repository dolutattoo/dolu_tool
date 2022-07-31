fx_version "cerulean"
game "gta5"
lua54 'yes'

shared_scripts{
  "shared/**/*",
}
client_scripts {
	"client/**/*.lua",
}

server_scripts{
  "server/**/*",
}

ui_page 'web/build/index.html'

files {
  'web/build/index.html',
  'web/build/**/*'
}