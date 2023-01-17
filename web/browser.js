window.addEventListener('message', function(event) {
    const item = event.data
    if (item.name === 'openBrowser' && item.url !== undefined) {
        window.invokeNative ? window.invokeNative('openUrl', item.url) : window.open(item.url)
    }
})