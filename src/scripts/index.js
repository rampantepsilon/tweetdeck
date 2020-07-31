const electron = require('electron');
const BrowserView = electron.remote.BrowserView;
const BrowserWindow = electron.remote.BrowserWindow;
const shell = electron.remote.shell;
const remote = electron.remote;

const Store = require('../store.js');

//Initialize Storage Method Store
const store = new Store(
  {
    configName: 'user-preferences',
    defaults:{
      windowBounds: { width: 1280, height: 720 }, //mainWindow default
      win2Bounds: { width: 620, height: 400 }, //secondWindow default (Possibly change to bigger?)
      tooltip: 'yes',
      tooltipLaunch: 'yes', //Default to show Notifications
      isMaximized: 'no', //Default to basic window size (Windows Only)
      isMaximized2: 'no'
    }
  }
);

let currentLoc = 'tweetdeck';

function redirect(location){
	let { width, height } = store.get('windowBounds'); //Get Stored window dimensions

	var views = BrowserView.getAllViews()
	views[0].destroy();
	console.log(BrowserView.getAllViews())
	let homeWindow = remote.getCurrentWindow();
	let view = new BrowserView();
  homeWindow.setBrowserView(view);
  view.setBounds({ x: 235, y: 20, width: (width - 265), height: (height - 100) });
  view.setAutoResize({ width: true, height: true })
	view.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  })
	if (location == 'tweetdeck'){
		view.webContents.loadURL('https://tweetdeck.twitter.com');
		currentLoc = location;
	}
	if (location == 'gmail'){
		view.webContents.loadURL('https://mail.google.com');
		currentLoc = location;
	}
	if (location == 'yahoo'){
		view.webContents.loadURL('https://mail.yahoo.com');
		currentLoc = location;
	}
	if (location == 'outlook'){
		view.webContents.loadURL('https://outlook.live.com');
		currentLoc = location;
	}
	if (location == 'aol'){
		view.webContents.loadURL('https://mail.aol.com');
		currentLoc = location;
	}
	if (location == 'yt'){
		view.webContents.loadURL('https://youtube.com');
		currentLoc = location;
	}
	if (location == 'twitch'){
		view.webContents.loadURL('https://twitch.tv');
		currentLoc = location;
	}
	if (location == 'ocr'){
		view.webContents.loadURL('https://rainwave.cc/ocremix/');
		currentLoc = location;
	}
	if (location == 'spotify'){
		view.webContents.loadURL('https://open.spotify.com/?utm_source=web-player&utm_campaign=bookmark');
		currentLoc = location;
	}
}

function popOut(){
	if (!store.get('win2Bounds')){
		store.set('win2Bounds', { width: 620, height: 400 })
	}
  if (!store.get('isMaximized2')){
    store.set('isMaximized2', 'no');
  }
	let { width, height } = store.get('win2Bounds');
  let isMaximized2 = store.get('isMaximized2');

	const secondWindow = new BrowserWindow({
    width: width,
    height: height,
    icon: __dirname + "/logo.png",
    title: currentLoc,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true
    }
  })

  if (process.platform == 'win32'){
    if (isMaximized2 == 'yes'){
      secondWindow.maximize();
    }
  }

	if (currentLoc == 'tweetdeck'){
		window.alert("Temporarily Unavailable Due to Bugs")
    secondWindow.close();
		//secondWindow.loadURL('https://tweetdeck.twitter.com');
	}
	if (currentLoc == 'gmail'){
		secondWindow.loadURL('https://mail.google.com');
	}
	if (currentLoc == 'yahoo'){
		secondWindow.loadURL('https://mail.yahoo.com');
	}
	if (currentLoc == 'outlook'){
		secondWindow.loadURL('https://outlook.live.com');
	}
	if (currentLoc == 'aol'){
		secondWindow.loadURL('https://mail.aol.com');
	}
	if (currentLoc == 'yt'){
		secondWindow.loadURL('https://youtube.com');
	}
	if (currentLoc == 'twitch'){
		secondWindow.loadURL('https://twitch.tv');
	}
	if (currentLoc == 'ocr'){
		secondWindow.loadURL('https://rainwave.cc/ocremix/');
	}
	if (currentLoc == 'spotify'){
		secondWindow.loadURL('https://open.spotify.com/?utm_source=web-player&utm_campaign=bookmark');
	}

	// Emitted when the window is maximized.
  secondWindow.on('maximize', function(event){
    store.set('isMaximized2', 'yes')
  })

  // Emitted when the window exits a maximized state.
  secondWindow.on('unmaximize', function(event){
    store.set('isMaximized2', 'no')
  })

  //Store Information About Size
  secondWindow.on('resize', () => {
    //Get Bounds
    let { width, height } = secondWindow.getBounds();
    //Save Information
    store.set('win2Bounds', { width, height });
  })

  secondWindow.on('minimize', () => {
    secondWindow.hide();
  })

  secondWindow.on('show', () => {
    if (process.platform == 'win32'){
      if (isMaximized2 == 'yes'){
        secondWindow.maximize();
      }
    }
  })

  secondWindow.on('close', () => {
    document.getElementById('popout').style.visibility = 'visible'
  })

	secondWindow.webContents.on('new-window', (event, url) => {
    shell.openExternal(url);
  })

  document.getElementById('popout').style.visibility = 'hidden';
}
