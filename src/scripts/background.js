const path = require('path');
const fs = require('fs');

// Importing dialog module using remote
const dialog = electron.remote.dialog;

var uploadFile = document.getElementById('upload');

// Defining a Global file path Variable to store
// user-selected file
global.filepath = undefined;

function uploadBackground() {
// If the platform is 'win32' or 'Linux'
	// Resolves to a Promise<Object>
	dialog.showOpenDialog({
		title: 'Select the File to be uploaded',
		defaultPath: path.join(__dirname, '../assets/'),
		buttonLabel: 'Upload',
		// Restricting the user to only Text Files.
		filters: [
			{
        name: 'Images',
				extensions: ['jpg', 'png']
			}, ],
		// Specifying the File Selector Property
		properties: ['openFile']
	}).then(file => {
		// Stating whether dialog operation was
		// cancelled or not.
		console.log(file.canceled);
		if (!file.canceled) {
		// Updating the GLOBAL filepath variable
		// to user-selected file.
		global.filepath = file.filePaths[0].toString();
		global.filepath = global.filepath.replace(/\\/g,'\/');
    global.filepath = 'file:///' + global.filepath;
    console.log(global.filepath);
    storeR.set('bckgrndUrl', global.filepath);
    document.body.style.backgroundImage = 'url("' + global.filepath + '")';
    document.body.style.backgroundPosition = "center center"
    document.body.style.backgroundSize = '100%';
		}
	}).catch(err => {
		console.log(err)
	});
}

function background(){
  if(storeR.get('bckgrndUrl') != 'none'){
    document.body.style.backgroundImage = 'url("' + storeR.get('bckgrndUrl') + '")';
    document.body.style.backgroundPosition = "center center"
    document.body.style.backgroundSize = '100%';
  }
  //document.body.style.backgroundSize = cover;
  redirect(currentLoc)

  if (storeR.get('menuCollapsed') == 'yes'){
    collapse();
  } else {
    document.getElementById('hide').style.visibility = 'hidden'
  }

	emailDefault()
	mediaDefault()
}

function emailDefault(){
	var eDefault = storeR.get("defaultMail");

	//document variables
	var gmail1 = document.getElementById('gmail1');
	var yahoo1 = document.getElementById('yahoo1');
	var outlook1 = document.getElementById('outlook1');
	var aol1 = document.getElementById('aol1');
	var gmail2 = document.getElementById('gmail2');
	var yahoo2 = document.getElementById('yahoo2');
	var outlook2 = document.getElementById('outlook2');
	var aol2 = document.getElementById('aol2');

	if (eDefault == 'gmail'){
		gmail1.removeAttribute('class');
		gmail2.removeAttribute('class');
		yahoo1.style.display = 'none';
		yahoo2.style.display = 'none';
		outlook1.style.display = 'none';
		outlook2.style.display = 'none';
		aol1.style.display = 'none';
		aol2.style.display = 'none';
	}
	if (eDefault == 'yahoo'){
		gmail1.style.display = 'none';
		gmail2.style.display = 'none';
		yahoo1.removeAttribute('class');
		yahoo2.removeAttribute('class');
		outlook1.style.display = 'none';
		outlook2.style.display = 'none';
		aol1.style.display = 'none';
		aol2.style.display = 'none';
	}
	if (eDefault == 'outlook'){
		gmail1.style.display = 'none';
		gmail2.style.display = 'none';
		yahoo1.style.display = 'none';
		yahoo2.style.display = 'none';
		outlook1.removeAttribute('class');
		outlook2.removeAttribute('class');
		aol1.style.display = 'none';
		aol2.style.display = 'none';
	}
	if (eDefault == 'aol'){
		gmail1.style.display = 'none';
		gmail2.style.display = 'none';
		yahoo1.style.display = 'none';
		yahoo2.style.display = 'none';
		outlook1.style.display = 'none';
		outlook2.style.display = 'none';
		aol1.removeAttribute('class');
		aol2.removeAttribute('class');
	}
	if (eDefault == 'all'){
		gmail1.removeAttribute('class');
		gmail2.removeAttribute('class');
		yahoo1.removeAttribute('class');
		yahoo2.removeAttribute('class');
		outlook1.removeAttribute('class');
		outlook2.removeAttribute('class');
		aol1.removeAttribute('class');
		aol2.removeAttribute('class');
	}
}

function mediaDefault(){
	var eDefault = storeR.get("defaultMedia");

	//document variables
	var yt1 = document.getElementById('yt1');
	var twitch1 = document.getElementById('twitch1');
	var ocr1 = document.getElementById('ocr1');
	var spotify1 = document.getElementById('spotify1');
	var yt2 = document.getElementById('yt2');
	var twitch2 = document.getElementById('twitch2');
	var ocr2 = document.getElementById('ocr2');
	var spotify2 = document.getElementById('spotify2');

	if (eDefault == 'yt'){
		yt1.removeAttribute('class');
		yt2.removeAttribute('class');
		twitch1.style.display = 'none';
		twitch2.style.display = 'none';
		ocr1.style.display = 'none';
		ocr2.style.display = 'none';
		spotify1.style.display = 'none';
		spotify2.style.display = 'none';
	}
	if (eDefault == 'twitch'){
		yt1.style.display = 'none';
		yt2.style.display = 'none';
		twitch1.removeAttribute('class');
		twitch2.removeAttribute('class');
		ocr1.style.display = 'none';
		ocr2.style.display = 'none';
		spotify1.style.display = 'none';
		spotify2.style.display = 'none';
	}
	if (eDefault == 'ocr'){
		yt1.style.display = 'none';
		yt2.style.display = 'none';
		twitch1.style.display = 'none';
		twitch2.style.display = 'none';
		ocr1.removeAttribute('class');
		ocr2.removeAttribute('class');
		spotify1.style.display = 'none';
		spotify2.style.display = 'none';
	}
	if (eDefault == 'spotify'){
		yt1.style.display = 'none';
		yt2.style.display = 'none';
		twitch1.style.display = 'none';
		twitch2.style.display = 'none';
		ocr1.style.display = 'none';
		ocr2.style.display = 'none';
		spotify1.removeAttribute('class');
		spotify2.removeAttribute('class');
	}
	if (eDefault == 'all'){
		yt1.removeAttribute('class');
		yt2.removeAttribute('class');
		twitch1.removeAttribute('class');
		twitch2.removeAttribute('class');
		ocr1.removeAttribute('class');
		ocr2.removeAttribute('class');
		spotify1.removeAttribute('class');
		spotify2.removeAttribute('class');
	}
}
