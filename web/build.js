const { execSync } = require("child_process")

const isPnpm = process.env.npm_execpath && process.env.npm_execpath.includes("pnpm")

function getCurrentPackageManager() {
  const execPath = process.env.npm_execpath
  if (execPath.includes("yarn")) {
    return "yarn"
  } else if (execPath.includes("npm")) {
    return "npm"
  } else if (execPath.includes("cnpm")) {
    return "cnpm"
  } else if (execPath.includes("turbo")) {
    return "turbo"
  } else {
    return "unknown"
  }
}

if (!isPnpm) {
  const currentPackageManager = getCurrentPackageManager()
  console.error(
    "\x1b[37m%s\x1b[31m%s\x1b[37m%s\x1b[34m%s\x1b[37m%s\x1b[34m%s\x1b[37m%s\x1b[0m",
    "\n------------------------\n ",
    "Build Error:",
    " Please use ",
    "pnpm",
    " instead of ",
    currentPackageManager,
    " to build the project.\n------------------------\n "
  )
  process.exit(2)
} else {
  execSync("tsc && vite build", { stdio: "inherit" })
}
