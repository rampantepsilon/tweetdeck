const path = require('path');
const fs = require('fs');

const bckgrnd = new Store(
  {
    configName: 'background',
    defaults:{
      url: 'none',
    }
  }
);

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
    bckgrnd.set('url', global.filepath);
    document.body.style.backgroundImage = 'url("' + global.filepath + '")';
    document.body.style.backgroundPosition = "center center"
    document.body.style.backgroundSize = '100%';
		}
	}).catch(err => {
		console.log(err)
	});
}

function background(){
  document.body.style.backgroundImage = 'url("' + bckgrnd.get('url') + '")';
  document.body.style.backgroundPosition = "center center"
  document.body.style.backgroundSize = '100%';
  //document.body.style.backgroundSize = cover;
  redirect('tweetdeck')

  if (storeR.get('menuCollapsed') == 'yes'){
    collapse();
  } else {
    document.getElementById('hide').style.visibility = 'hidden'
  }
}
