const { app, BrowserWindow } = require('electron');
path = require('path');
url = require('url');
app.on('ready', function() {
    console.log('Starting application!');
    mainWindow = new BrowserWindow({ width: 1280, height: 960 });

    // Change loadUrl to load index.html
    // using url and path package
    // to format the file url
    mainWindow.loadURL(url.format({
        //__dirname is the current working dir
        pathname: path.join(__dirname, 'dist', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Opens dev tools
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
app.on('window-all-closed', function() {
    app.quit();
});
