const electron = require('electron');
const { ipcRenderer } = require('electron');
const BrowserView = electron.remote.BrowserView;
const BrowserWindow = electron.remote.BrowserWindow;
const shell = electron.remote.shell;
const remote = electron.remote;

const Store = require('../src/store.js')

//Initialize Storage Method Store
var storeR = remote.getGlobal('store');
var pLocations = new Store(
  {
    configName: 'bookmarks',
    defaults:{
      name: ['rampantdock'],
      url: ['https://github.com/rampantepsilon/rampantdock/releases'],
      logo: ['https://raw.githubusercontent.com/rampantepsilon/rampantdock/master/logo.png'],
      formattedName: ['RampantDock']
    }
  }
);

let currentLoc = 'tweetdeck';

var locTrackers = ['tweetdeck','gmail','yahoo','outlook','aol','yt','twitch','ocr','spotify','discord','gdrive']
var locations = ['https://tweetdeck.twitter.com','https://mail.google.com','https://mail.yahoo.com','https://outlook.live.com','https://mail.aol.com','https://youtube.com','https://twitch.tv','https://rainwave.cc/ocremix/','https://open.spotify.com/?utm_source=web-player&utm_campaign=bookmark','https://discord.com/channels/@me','https://drive.google.com']
var addOnLocations = ['tweetdeck','gmail','yahoo','outlook','aol','yt','twitch','ocr','spotify','discord','gdrive']
var addOnURLs = ['https://tweetdeck.twitter.com','https://mail.google.com','https://mail.yahoo.com','https://outlook.live.com','https://mail.aol.com','https://youtube.com','https://twitch.tv','https://rainwave.cc/ocremix/','https://open.spotify.com/?utm_source=web-player&utm_campaign=bookmark','https://discord.com/channels/@me','https://drive.google.com']
var logos = ['images\\tweetdeck.png','images\\gmail.png','images\\yahoo.png','images\\outlook.png','images\\aol.png','images\\yt.png','images\\twitch.png','images\\ocr.png','images\\spotify.png','images\\discord.png','images\\gdrive.png'] //Only needed to keep spacing

//Variables for current Values
var bNameStorage = []
var bUrlStorage = []
var bLogoStorage = []
var bFNameStorage = []

function onLoad(){
  if (storeR.get('firstRun') == 'yes'){
    console.log('Yes')
    pLocations.set('name', ['rampantdock']);
    pLocations.set('url',['https://github.com/rampantepsilon/rampantdock/releases']);
    pLocations.set('logo',['https://raw.githubusercontent.com/rampantepsilon/rampantdock/master/logo.png']);
    pLocations.set('formattedName',['RampantDock'])
    console.log('created')
    ipcRenderer.send('firstRun', 'no')
  }
  for (var i = (pLocations.get('name').length - 1); i > -1; i--){
    addOnLocations.push(pLocations.get('name')[i]);
    addOnURLs.push(pLocations.get('url')[i]);
    logos.push(pLocations.get('logo')[i]);

    //Add to tables
    var tableLarge = document.getElementById('tableLarge');
    var tableSmall = document.getElementById('tableSmall');
    var rowL = tableLarge.insertRow(11);
    var rowS = tableSmall.insertRow(11);
    var cellL = rowL.insertCell(0);
    var cellS = rowS.insertCell(0);

    cellL.setAttribute('class', 'links');
    cellL.setAttribute('align', 'center');
    cellL.setAttribute('onclick', 'redirect("' + pLocations.get('name')[i] + '")');
    cellL.innerHTML = `
    <div id='container'>
      <div id='icon'><img src ='` + pLocations.get('logo')[i] + `' width='30px' height='30px'></div>
      ` + pLocations.get('formattedName')[i] + `
    </div>`;

    cellS.setAttribute('class', 'links');
    cellS.setAttribute('align', 'center');
    cellS.setAttribute('onclick', 'redirect("' + pLocations.get('name')[i] + '")');
    cellS.innerHTML = `
    <div id='container'>
      <div id='icon2'><img src ='` + pLocations.get('logo')[i] + `' width='30px' height='30px'></div>
    </div>`;
  }
}

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
  for (var i = 0; i < addOnLocations.length; i++){
    if (location == addOnLocations[i]){
      view.webContents.loadURL(addOnURLs[i]);
      currentLoc = location;
    }
  }
}

function popOut(){
  if (!locTrackers.includes(currentLoc)){
    window.alert(`Added Links Aren't Supported Currently`);
  } else {
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

    for (var i = 0; i < locTrackers.length; i++){
      if (currentLoc == 'discord'){
        secondWindow.close();
    		window.alert("Unavailable Due To Technical Issues")
      } else {
        if (currentLoc == locTrackers[i]){
          secondWindow.loadURL(locations[i])
        }
      }
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

  	if (currentLoc != 'gdrive'){
      secondWindow.webContents.on('new-window', (event, url) => {
        var windows = BrowserWindow.getAllWindows();
        if (windows[2]){
          windows[0].close();
        }
        shell.openExternal(url);
      })
    }

    document.getElementById('popout').style.visibility = 'hidden';
  }
}

function add(){
  //Show Window
  window.open('addBMark.html')
}

function addLink(timing){
  for (var i = 0; i < pLocations.get('name').length; i++){
    bNameStorage[i] = pLocations.get('name')[i];
    bUrlStorage[i] = pLocations.get('url')[i];
    bLogoStorage[i] = pLocations.get('logo')[i];
    bFNameStorage[i] = pLocations.get('formattedName')[i];
  }
  console.log(bNameStorage, bUrlStorage, bLogoStorage, bFNameStorage)
  //Get information
  var fName = document.getElementById('fNameBMark').value;
  var name = document.getElementById('nameBMark').value;
  var url = document.getElementById('urlBMark').value;
  var icon = document.getElementById('logoBMark').value;

  var j = bNameStorage.length;

  bNameStorage[j] = name;
  bUrlStorage[j] = url;
  bLogoStorage[j] = icon;
  bFNameStorage[j] = fName;

  console.log(bNameStorage, bUrlStorage, bLogoStorage, bFNameStorage)

  completeAddLink(timing)
  window.close()
}

function completeAddLink(time){
  pLocations.set('name', bNameStorage);
  pLocations.set('url', bUrlStorage);
  pLocations.set('logo', bLogoStorage);
  pLocations.set('formattedName', bFNameStorage);

  if (time == 'now'){
    var windows = BrowserWindow.getAllWindows();
    if (windows[1]){
      windows[1].reload();
    } else {
      windows[0].reload();
    }
  }
}

ipcRenderer.on('change', function(event, message){
  location.reload();
  console.log(message)
})
