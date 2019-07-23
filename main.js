/*
The main javascript file for launching electron
*/
const electron=require('electron');


//Gets the app and browser window objects from electron
const {app,BrowserWindow}=electron;
//initialize the main window
let mainWindow;

//whenever the app loads
app.on('ready',function(){

   
    //creates a new browser window
    mainWindow=new BrowserWindow({
        //makes the width and the height
        width:1200,
        height:800,
        frame:false
    
    });

    //mainWindow.webContents.openDevTools();
    //loads the html for our game/file explorer
    mainWindow.loadFile("./src/index.html");
    //focuses the window
    mainWindow.focus();
   
    
    //whenever the main window is closed, it quits the app
    mainWindow.on('closed',function(){
        app.quit();
    })

});




