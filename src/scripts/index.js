const electron = require('electron');
const BrowserView = electron.remote.BrowserView;
const BrowserWindow = electron.remote.BrowserWindow;
const shell = electron.remote.shell;
const remote = electron.remote;

const Store = require('../src/store.js')

//Initialize Storage Method Store
var storeR = remote.getGlobal('store') /*new Store(
  {
    configName: 'user-preferences',
    defaults:{
      bckgrndUrl: 'none',
      windowBounds: { width: 1280, height: 720 }, //mainWindow default
      win2Bounds: { width: 800, height: 450 }, //secondWindow default
      tooltip: 'yes',
      tooltipLaunch: 'yes', //Default to show Notifications
      isMaximized: 'no', //Default to basic window size (Windows Only)
      isMaximized2: 'no', //Default to second window size (Windows Only)
      menuCollapsed: 'no' //Sidebar Collapsed
    }
  }
);*/

let currentLoc = 'tweetdeck';

function collapse(){
  let { width, height } = storeR.get('windowBounds'); //Get Stored window dimensions
  var views = BrowserView.getAllViews();
  views[0].setBounds({ x: 85, y: 15, width: (width - 125), height: (height - 100) });
  views[0].setAutoResize({ width: true, height: true })
  document.getElementById('hide').style.visibility = 'visible'
  document.getElementById('init').style.display = 'none';
  document.getElementById('poTable').style.width = '60px';
  document.getElementById('poText').style.display = 'none';
  document.getElementById('poIcon').style.top = '-15px';
  document.getElementById('poIcon').style.left = '10px';

  storeR.set('menuCollapsed', 'yes')
}

function expand(){
  let { width, height } = storeR.get('windowBounds'); //Get Stored window dimensions
  var views = BrowserView.getAllViews();
  views[0].setBounds({ x: 235, y: 15, width: (width - 275), height: (height - 100) });
  document.getElementById('hide').style.visibility = 'hidden'
  document.getElementById('init').style.display = 'block';
  document.getElementById('poTable').style.width = '220px';
  document.getElementById('poText').style.display = 'block';
  document.getElementById('poIcon').style.top = '4px';
  document.getElementById('poIcon').style.left = '20px';

  storeR.set('menuCollapsed', 'no')
}

function redirect(location){
	let { width, height } = storeR.get('windowBounds'); //Get Stored window dimensions

	var views = BrowserView.getAllViews()
	//views[0].destroy();
	console.log(BrowserView.getAllViews())
	let homeWindow = remote.getCurrentWindow();
	let view = views[0]
  //homeWindow.setBrowserView(view);
  if (storeR.get('menuCollapsed') == 'no'){
    view.setBounds({ x: 235, y: 15, width: (width - 275), height: (height - 100) });
  }
  if (storeR.get('menuCollapsed') == 'yes'){
    view.setBounds({ x: 85, y: 15, width: (width - 125), height: (height - 100) });
  }
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
  var iconVar = currentLoc + ".png"
	if (!storeR.get('win2Bounds')){
		storeR.set('win2Bounds', { width: 620, height: 400 })
	}
  if (!storeR.get('isMaximized2')){
    storeR.set('isMaximized2', 'no');
  }
	let { width, height } = storeR.get('win2Bounds');
  let isMaximized2 = storeR.get('isMaximized2');

  console.log(iconVar);

	const secondWindow = new BrowserWindow({
    width: width,
    height: height,
    icon: __dirname + '\\images\\' + iconVar,
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
    storeR.set('isMaximized2', 'yes')
  })

  // Emitted when the window exits a maximized state.
  secondWindow.on('unmaximize', function(event){
    storeR.set('isMaximized2', 'no')
  })

  //Store Information About Size
  secondWindow.on('resize', () => {
    //Get Bounds
    let { width, height } = secondWindow.getBounds();
    //Save Information
    storeR.set('win2Bounds', { width, height });
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
    var windows = BrowserWindow.getAllWindows();
    if (windows[2]){
      windows[0].close();
    }
    shell.openExternal(url);
  })

  document.getElementById('popout').style.visibility = 'hidden';
}
