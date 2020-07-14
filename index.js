const { app, BrowserWindow, BrowserView, Menu, Tray, Notification, globalShortcut, shell } = require('electron')
const path = require('path');
const Store = require('./store.js');

//Information About App
function versionNum(){
  const version = app.getVersion();
  return version;
}
//Build Number
function buildNum(){
  const build = '2020.07.14';
  return build;
}

//Title
function title(){
  var title = 'TweetDeck Standalone Client';
  return title;
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
var not2;

const store = new Store({
  configName: 'user-preferences',
  defaults:{
    windowBounds: { width: 1280, height: 720}
  }
});

//Application menu
let menuT = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        role: 'undo',
        accelerator: 'CommandOrControl+Z'
      },{
        label: 'Redo',
        role: 'redo',
        accelerator: 'CommandOrControl+Y'
      },{
        type: 'separator'
      },{
        label: 'Cut',
        role: 'cut',
        accelerator: 'CommandOrControl+X'
      },{
        label: 'Copy',
        role: 'copy',
        accelerator: 'CommandOrControl+C'
      },{
        label: 'Paste',
        role: 'paste',
        accelerator: 'CommandOrControl+V'
      },{
        label: 'Delete',
        role: 'delete'
      },{
        type: 'separator'
      },{
        label: 'Select All',
        role: 'selectAll',
        accelerator: 'CommandOrControl+A'
      }
    ]
  },{
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        role: 'reload',
        accelerator: 'F5'
      },{
        label: 'Clear Cache & Reload',
        role: 'forceReload',
        accelerator: 'CommandOrControl+F5'
      },{
        type: 'separator'
      },{
        label: 'Actual Size',
        role: 'resetZoom',
        accelerator: 'CommandOrControl+0'
      },{
        label: 'Zoom In',
        role: 'zoomIn',
        accelerator: 'CommandOrControl+Plus'
      },{
        label: 'Zoom Out',
        role: 'zoomOut',
        accelerator: 'CommandOrControl+-'
      },{
        type: 'separator'
      },{
        label: 'Toggle Full Screen',
        role: 'togglefullscreen',
        accelerator: 'CommandOrControl+F11'
      }
    ]
  },{
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        role: 'minimize',
        accelerator: 'CommandOrControl+M'
      },{
        label: 'Close',
        role: 'close',
        accelerator: 'CommandOrControl+W'
      }
    ]
  },{
    label: 'About',
    role: 'about',
    submenu: [
      {
        label: title(),
        enabled: false,
      },{
        label: "Version " + versionNum(),
        enabled: false,
      },{
        label: "Build: " + buildNum(),
        enabled: false,
      },{
        label: "Changelog",
        visible: false,
        click(){

        }
      }
    ]
  }
]

function createWindow () {
  var count = 0;
  var show = true;
  let { width, height } = store.get('windowBounds');

  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    icon: __dirname + "/logo.png",
    title: title(),
    webPreferences: {
      nativeWindowOpen: true
    }
  })
  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    if (frameName === 'submenu') {
      // open window as modal
      event.preventDefault()
      Object.assign(options, {
        modal: true,
        parent: mainWindow,
        width: 1280,
        height: 720,
        title: title(),
      })
      event.newGuest = new BrowserWindow(options)
    }
  })

  mainWindow.loadURL('https://tweetdeck.twitter.com')
  //mainWindow.loadFile('src/index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  //Add Menu
  const menu = Menu.buildFromTemplate(menuT)
  Menu.setApplicationMenu(menu)

  //Store Information About Size
  mainWindow.on('resize', () => {
    //Get Bounds
    let { width, height } = mainWindow.getBounds();
    //Save Information
    store.set('windowBounds', { width, height });
  })

  // Emitted when the window is closed.
  mainWindow.on('minimize', function(event){
    event.preventDefault();
    show = false;
    mainWindow.hide();
  })

  mainWindow.on('close', function(event){
    event.preventDefault();
    show = false;
    mainWindow.hide();
    event.returnValue = false;
  })

  mainWindow.on('hide', function(event){
    show = false;
    myNotification.show();
    not2 = setInterval(notif2, 1800000)
  })

  mainWindow.on('show',function(event){
    clearInterval(not2);
  })

  tray = new Tray(__dirname + '/logo.png');

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'TweetDeck', enabled: false, icon: __dirname + '/logo.png'
    },
    {
      type: 'separator'
    },
    {
      label: 'Open TweetDeck', click: function () {
        mainWindow.show();
      }
    },
    {
      label: 'Quit', click: function () {
        mainWindow.destroy();
        app.quit();
      }
    }
  ]));

  const myNotification = new Notification({
    title: 'TweetDeck',
    body: 'TweetDeck is still running. Right-click the icon in the taskbar to close.',
    icon: __dirname + '/logo.png'
  })

  function notif2(){
    secondNotif.show();
  }

  const secondNotif = new Notification({
    title: 'TweetDeck',
    body: 'Did you know? Press Ctrl+Alt+Shift+T or CMD+Alt+Shift+T to open/minimize TweetDeck.',
    icon: __dirname + '/logo.png'
  })

  const promotion = new Notification({
    title: 'TweetDeck',
    body: 'Like what you see? Consider Donating to the Developer! Visit paypal.me/tomjware',
    icon: __dirname + '/logo.png'
  })

  function promo(){
    promotion.show();
  }
  setInterval(promo, 7200000)

  globalShortcut.register('CommandOrControl+Alt+Shift+T', () => {
    if (show == true){
      mainWindow.hide();
      show = false;
    } else {
      mainWindow.show();
      show = true;
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
