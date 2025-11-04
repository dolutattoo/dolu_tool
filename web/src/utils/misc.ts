// Will return whether the current environment is in a regular browser
// and not CEF
export const isEnvBrowser = (): boolean => !window.invokeNative

// Basic no operation function
export const noop = () => {}

// Open a URL using the native FiveM method if available, otherwise fallback to window.open
export const openUrl = (url: string) => window.invokeNative ? window.invokeNative('openUrl', url) : window.open(url)
