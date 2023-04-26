const isYarn = process.env.npm_execpath && process.env.npm_execpath.includes("yarn")

if (isYarn) {
  console.error(
    "\x1b[37m%s\x1b[31m%s\x1b[37m%s\x1b[34m%s\x1b[37m%s\x1b[34m%s\x1b[37m%s\x1b[0m",
    "\n------------------------\n ",
    "Dolu Tool Error:",
    " Please use ",
    "pnpm",
    " instead of ",
    "yarn",
    " to build the project.\n------------------------\n "
  )
  process.exit(2)
} else {
  // Add your build command here, e.g., using 'child_process' to run a shell command
  const { execSync } = require("child_process")
  execSync("tsc && vite build", { stdio: "inherit" })
}
