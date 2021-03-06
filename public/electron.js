const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
// const fs = require('fs');
// const ini = require('ini');
// const content = fs.readFileSync('./public/config.ini', 'utf8');
// const config = ini.parse(content);
//console.log(config);
const ipc = electron.ipcMain;

let mainWindow;

function createWindow() {
      mainWindow = new BrowserWindow({ width: 900, height: 680 });
      mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
      mainWindow.on('closed', () => mainWindow = null);
      mainWindow.webContents.openDevTools()
      setInterval(function(){
            console.log("send message");
            mainWindow.webContents.send('message', {
            msg: 'Hello World!'
      });
      }, 3000);
      ipc.on("callback",(event, data)=>{
            console.log(data);
      })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
            app.quit();
      }
});

app.on('activate', () => {
      if (mainWindow === null) {
            createWindow();
      }
});