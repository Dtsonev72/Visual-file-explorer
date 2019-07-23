const Phaser=require('phaser');


//Passed data object (the game starts in current directory)
const passedData={
    currDir:__dirname,
    srcDir:"",
    fileReq:"",
    cutBool:false,
    monster:null
};

//The preloading scene
class PreloadScene extends Phaser.Scene {

  constructor() {
    super({
      key: 'PreloadScene'
    })

  }

preload()
 {  
 }


create ()
{ 
  //starts the boots scene with the starting data  
  this.scene.start('BootScene',passedData);
  
}
}


module.exports = PreloadScene;

