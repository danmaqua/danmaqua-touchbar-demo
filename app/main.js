const { app, ipcMain, BrowserWindow } = require('electron');
const TouchBarController = require('./touchbar');

let window;
let touchBarController;

app.commandLine.appendArgument('no-proxy-server');

function onAppReady() {
    window = new BrowserWindow({
        titleBarStyle: 'hiddenInset',
        title: 'Danmaqua Demo',
        width: 600,
        height: 300,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    touchBarController = new TouchBarController(window);
    touchBarController.on('enter', () => window.webContents.send('goButton'));
    touchBarController.on('filter', () => window.webContents.send('filter'));

    goIndex();
}

function goIndex() {
    window.setSize(600, 300);
    window.setResizable(false);
    window.setMaximizable(false);
    window.center();
    window.loadFile('app/index/index.html');
    touchBarController.setIndexBar();
}

function goRoom(roomId) {
    window.setSize(1600, 900);
    window.setResizable(true);
    window.setMaximizable(true);
    window.center();
    window.loadFile('app/player/index.html', {query: {'roomId': roomId}});
    touchBarController.setPlayerBar();
}

app.once('ready', onAppReady);
ipcMain.on('goRoom', (event, arg) => goRoom(Number(arg)));
ipcMain.on('setSubtitle', (event, arg) => touchBarController.updateSubtitle(arg));
ipcMain.once('exit', () => app.exit());
