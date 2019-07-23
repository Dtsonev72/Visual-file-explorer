//All libraries and objects needed to construct the game
const Phaser=require('phaser');
const Monster=require('../sprites/monsters');
const fileFuncs=require('../fileFuncs/files');
const helperFuncs=require('../fileFuncs/helperFuncs');
const path=require('path');
const Bullet=require('../sprites/bullets')

//Variables for the map and the sprite
let player,map,tiles; 

//This object is gonna be passed through all of the scenes
//This is how the data is saved for the file functions
const newData={
  currDir:__dirname,
  srcDir:"",
  fileReq:"",
  cutBool:false,
  monster:null
}

//keep track of the x and y of the enemies
let prevX,prevY;
//array of the files
let arr;
//The scene
let currScene;
//The door to go back a file dir
let backDoor;
//the destination path (usually the current dir + file name)
let destPath;

//Initializes a group of objects for enemies and bullets
const enemy=new Phaser.GameObjects.Group;
const bullet=new Phaser.GameObjects.Group;



//A function to load the map
function loadMap(scene)
{ 
    //Creates a tile map
    map=scene.make.tilemap({key:'map'})
    //It adds the tileset image
    tiles = map.addTilesetImage('Tilemap','tiles')
    //adds the two layers from the assets folder
    map.createStaticLayer('Floor',tiles,0,0);
    map.createStaticLayer('TopWall',tiles,0,0);
    
}

//The booting scene
class BootScene extends Phaser.Scene {

  constructor() {
    //Assigns it a key in order to call it
    super({
      key: 'BootScene'
    })


  }


//Initialize function from phaser, it takes a data passed to it
init(data)
{
  //gets the current scene
  currScene=this;
  //assigns the data object to the newData object
  newData.currDir=data.currDir;
  newData.srcDir=data.srcDir;
  newData.fileReq=data.fileReq;
  newData.cutBool=data.cutBool;
  newData.monster=data.monster;
  //Puts the files into the array variable
  arr=fileFuncs.getFile(data.currDir);
  //This text is at the top of the level to see the working directory
  this.add.text(16,0,data.currDir,{fontSize:"12px"})

  
}
//This phaser function is used to preload all of the images and spritesheets
preload()
{   

    //Loads the sprite sheet for th player
    this.load.spritesheet('knight','../assets/knight_spritesheet.png',
    {
        frameWidth:16.3,
        frameHeight:28
    });

    //Image for the bullets
    this.load.image('bullet','../assets/bomb.png')
    //Spritesheet for the files
    this.load.spritesheet('demon','../assets/demon_spritesheet.png',
    {
        frameWidth:32,
        frameHeight:36
    });
    //Spritesheet for the folders
    this.load.spritesheet('zombie','../assets/zombie_spritesheet.png',
    {
        frameWidth:32,
        frameHeight:34
    });

    //loads the door spritesheet
    this.load.spritesheet('door','../assets/door_spritesheet.png',
    {
        frameWidth:32,
        frameHeight:32
    });

    //Loads the tilemap from the tiles
    this.load.image('tiles','../assets/map/Tilemap.png')
    //This loads the whole level design
    this.load.tilemapTiledJSON('map','../assets/map/map.json');
    //Loads the hp bar images
    this.load.image('hpdecor','../assets/health_bar_decoration.png');
    this.load.image('hpbar','../assets/health_bar.png');

}

//This function is made in order to actually add everything to the scene
create ()
{
  //Map all these keys to 'keys' variable to use as events
  this.keys=this.input.keyboard.addKeys({
    copy: 'C',
    cut: 'X',
    paste: 'V',
    info: 'I',
    space:'SPACE',
    delete:'D',
    createDir:'K',
    createFile:'L',
    up:'UP',
    down:'DOWN',
    left:'LEFT',
    right:'RIGHT'
});

    //Calls the helper function to load all of the animations
    helperFuncs.loadAnims(this);

    //Loads the whole map with all of the layers
    loadMap(this);

    //gets each object layer as there are multiple
    map.objects.forEach(objLayer => { 
        //then gets the object on that object layer
        objLayer.objects.forEach(obj=>{ 
            //Each object has a property name 
            let name=obj.properties.find(prop=>prop.name==='name').value;
            //if the object is an enemy
            if(name==='enemy')
            {   
              //get the previous coordinates of the monster
              prevX=obj.x;
              prevY=obj.y;
              //Iterate through the whole array of files to add new monsters
              arr.forEach(file=>{
                //create a new enemy with the monster class
                const newEnemy=new Monster(this,prevX,prevY,file); 
                //if it is a folder
                if(file.directory===true)
                {
                  //Set the enemy's texture and animations to the zombie spritesheet
                  newEnemy.setTexture('zombie');
                  newEnemy.anims.play('zombie_idle', true);
                }
                else //if it is a file
                {
                //set the enemy's texture and animations to the demon spritesheet
                newEnemy.setTexture('demon');
                newEnemy.anims.play('demon_idle', true);
                }
                //flip the spritesheet
                newEnemy.flipX=true;
                //set it to a static object
                newEnemy.body.immovable=true;
                //Add it to the enemy group
                enemy.add(newEnemy);
                prevX=prevX+50;
            
              });
              
            
            }
            //if object's property is the player
            else if(name === 'player')
            {     
              //spawns the player at that object's x and y
               player=helperFuncs.createPlayer(this,obj.x,obj.y,'knight');
      
            }
            //if the object's property is the door
            else if(name === 'door')
            {
              //just adds the sprite image at those coordinates
              backDoor=this.physics.add.sprite(obj.x,obj.y,'door')
             
            }
        })
    });
    //creates the bottom walls of the map so that it is infront of the player
    const bound = map.createStaticLayer('Walls',tiles);
   
    //Checks for a click
    this.input.on('pointerdown', function () {
      //creates a bullet from the bullet class
      const newBullet=new Bullet(this);
      //adds it to the bullet group
      bullet.add(newBullet);
      //Very important function as it converts the click coordinates to the actual ingame coordinates
      const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
      //Executes the fire function
      newBullet.fire(player,worldPoint);

   
    }, this);
  
  //adds collision between the bullet and enemy
  this.physics.add.collider(bullet, enemy,(obj1,obj2)=>
    {
       
 
          //Sets the object a red hue
          helperFuncs.tintSetter(obj2,0xff2d44);
          //damages the enemy and reduces the health
          helperFuncs.damageEnemy(obj2,obj1,newData.currDir);
          //waits for a while before resetting the tint
          this.time.delayedCall(200, ()=>
          {
            helperFuncs.tintSetter(obj2,0xffffff);
          });
            
          
    });

   
  //Adds a check if two objects overlap
  this.physics.add.overlap(player, enemy,(obj1,obj2)=>
    {
      //if the enemy is a directory
      if(obj2.directory===false)
      {
       //switch statement for which keys are pressed
       switch(true)
       {
        //if 'i' is pressed 
        case this.keys.info.isDown:
              obj2.info();//display info on that object
        break;
        //if 'd' is pressed 
        case this.keys.delete.isDown:
            //deletes the file
            fileFuncs.deleteFile(path.join(newData.currDir,obj2.fileName))
            //removes it from the map
            obj2.remove();
        break;
        //if 'x' is pressed
        case this.keys.cut.isDown:
              //set the data value to true so that cut is enacted
              newData.cutBool=true;
              //gets the monster that it was pressed on
              newData.monster=obj2;
              //displays a text above the player that says cut and the file name
              const cutText=this.add.text(player.x-10,player.y-30,"Cut: "+obj2.fileName,{fontSize:"8px",resolution:5})
              cutText.setStroke('rgb(0, 0, 0)',2);
              //waits a second and removes the text
              this.time.delayedCall(400,()=>
              {
                cutText.destroy()
              })
              //Gets the file name of the enemy's name
              newData.fileReq=obj2.fileName;
              //joins the path and puts it as a source 
              newData.srcDir=path.join(newData.currDir,obj2.fileName);
              //removes the object
             obj2.remove();
        break;
        //if the 'c' key is pressed
        case this.keys.copy.isDown:
              //gets the monster
              newData.monster=obj2;
              //sets that it hasn't been cut
              newData.cutBool=false;
              //creates text above the players head to show that he has copied that file
              const copyText=this.add.text(player.x-10,player.y-30,"Copied: "+obj2.fileName,{fontSize:"8px",resolution:5})
              copyText.setStroke('rgb(0, 0, 0)',2);
              //waits a sec before destroying the text
              this.time.delayedCall(300,()=>
              {
                copyText.destroy()
              })
              //sets the file name in the filereq 
              newData.fileReq=obj2.fileName;
              //gets the source directory of where we got the file from
              newData.srcDir=path.join(newData.currDir,obj2.fileName);
       
        break;
      
      }
    }
    else //if the object is a folder
    {
      //if you press space
      if(this.keys.space.isDown)
              {
                //we set the current directory to whatever directory you are on
                newData.currDir=path.join(newData.currDir,obj2.fileName)
                //restart the game with that current directory
                this.scene.restart(newData)
              
              }
      //if you press 'i' on a folder
      else if(this.keys.info.isDown)
      {
        obj2.info();
      }
      //if the delete 'd' key is pressed on the directory it will delete it
      else if(this.keys.delete.isDown)
      {     
            fileFuncs.deleteDir(path.join(newData.currDir,obj2.fileName))
            obj2.remove();
      }
    }
    });


//An event to see if the user presses the 'v' button to paste
this.keys.paste.on('down',function(){
    if(newData.srcDir==="")//if there is no source directory
    {
      //add text that says nothing to paste above the player
      const pasteText=currScene.add.text(player.x-40,player.y-30,"Nothing to paste",{fontSize:"8px",resolution:5,align:'center'})
      pasteText.setStroke('rgb(0, 0, 0)',2);
      currScene.time.delayedCall(300,()=>
              {
                pasteText.destroy()
              })
    }
    //if there is a source directory
    else{
      //we check to see if the command is to cut
      if(newData.cutBool===false)
      {
        //gets the destination path by joining the current path and the file name
        destPath=path.join(newData.currDir,newData.fileReq)
        //use the copy file function
        fileFuncs.copyFile(newData.srcDir,destPath);
        //restart the scene to render the sprites
        currScene.scene.restart(newData)
      }
      //if the command is to cut
      else if(newData.cutBool===true)
      {
        //join the current directory to the file name
        destPath=path.join(newData.currDir,newData.fileReq)
        //uses the function to move file
        fileFuncs.moveFile(newData.srcDir,destPath);
        newData.srcDir="";//resets the source directory
        newData.monster=null;//nulls out the monster
        currScene.scene.restart(newData);//restarts the scene to render the sprites
        
      }
      
      }  
    })

  //event to check if the player overlaps with the door
  this.physics.add.overlap(player,backDoor,()=>{
    //if the player presses space on the door
    if(this.keys.space.isDown)
    {
      //plays the door open anim
      backDoor.anims.play('door_open',true);
      this.time.delayedCall(200, ()=>
          {
            //gets the previous directory of the current directory
            newData.currDir=path.join(newData.currDir,'..');
            //restarts the scene to render the sprites
            this.scene.restart(newData)
          });
      
    }
  
  })

//if you press 'k' to create a new directory
this.keys.createDir.on('down',function(){
 
  //communicates with the DOM to get the element form
  document.getElementById("nameD").style.display="block";
  
  //disables phaser from getting input capture
  currScene.input.keyboard.disableGlobalCapture();
  //disables the input just to be sure
  currScene.input.keyboard.enabled=false;
  //focuses the form
  document.getElementById("fileDir").focus();
  //Event that listens to the enter button
  document.getElementById("nameD").addEventListener("submit", (e)=>{
    e.preventDefault();//prevents the default action by not refreshing the page
    //joins the name in the form with the current directory to create a new folder
    const newDir=path.join(newData.currDir,document.getElementById("fileDir").value);
    //Creates a new directory
    fileFuncs.createDir(newDir);
    //hides the element and resets the value 
    document.getElementById("nameD").style.display="none";
    document.getElementById("fileDir").value = '';
    //reenables input from the keyboard
    currScene.input.keyboard.enabled=true;
    //restarts the scene
    currScene.scene.restart(newData);
  });
})

//if the player presses the 'l' button, which is to create a file
this.keys.createFile.on('down',function(){
  //enables the display of the element
  document.getElementById("nameF").style.display="block";
  //removes the scene from listening for inputs  
  currScene.input.keyboard.disableGlobalCapture();
  currScene.input.keyboard.enabled=false;
  //focuses on the element
  document.getElementById("fileName").focus();

  //on the enter event
  document.getElementById("nameF").addEventListener("submit", (e)=>{
    e.preventDefault();//prevents it from refreshing the page
    //makes a new file by getting the current directory and adding the value
    const newFile=path.join(newData.currDir,document.getElementById("fileName").value);
    //creates the file
    fileFuncs.createFile(newFile,'');
    //hides the element and clears out the value
    document.getElementById("nameF").style.display="none";
    document.getElementById("fileName").value = '';
    //reenables the keyboard
    currScene.input.keyboard.enabled=true;
    //restarts the scene
    currScene.scene.restart(newData);
  });
})

 //follows the player
  this.cameras.main.startFollow(player);
  this.cameras.main.zoom=3;
 
   //sets the world bounds so the players doesn't go out of it
    this.physics.world.setBounds(20,14,bound.width-41,bound.height-22);
    player.setCollideWorldBounds(true);


}

//this functions is to check for continual updates
update(time,delta){

  
    //checks the children of the bullets
    bullet.getChildren().forEach((child)=>
    { 
      //this is remove the bullet after a certain time
      child.update(time,delta);
    })
   
    /*
      PLAYER MOVEMENT
   */

   //Checks to see if the left button is pressed
    if (this.keys.left.isDown)
    {
        //switch statement to check if other buttons are pressed
        switch(true)
        {   //if the button is up then set velocity of Y
            case this.keys.up.isDown:
            player.setVelocityY(-160)
            break;
            //sets the velocity to a downward vector
            case this.keys.down.isDown:
            player.setVelocityY(160)
            break;
            default://if no buttons are pressed then idle in the y direction
            player.setVelocityY(0);
            break;
        }
        player.setVelocityX(-160);

       player.flipX=true;//have to flip the spritesheet
        player.anims.play('left', true);//plays the animation of running
    }
    //if the right button is pressed
    else if (this.keys.right.isDown)
    {
        switch(true)
        {
            case this.keys.up.isDown://checks the the up button
            player.setVelocityY(-160) //set the respective Y vector
            break;
            case this.keys.down.isDown://checks to see if the down button is pressed
            player.setVelocityY(160)//set the respective Y vector
            break;
            default://idle in Y coordinatee
            player.setVelocityY(0);
            break;
        }
        player.setVelocityX(160);
      
        player.flipX=false;
        player.anims.play('right', true);
    }
    //A combination of keys of up plus left or right
    else if (this.keys.up.isDown)
     {
        switch(true)
        {
            case this.keys.left.isDown:
            player.setVelocityX(-160)
            break;
            case this.keys.right.isDown:
            player.setVelocityX(160)
            break;
            default:
            player.setVelocityX(0);
            break;
        }
         player.setVelocityY(-160);
         
        
         player.anims.play('left', true);
     }
     //A combination of keys of down plus others
     else if (this.keys.down.isDown)
     {

        switch(true)
        {
            case this.keys.left.isDown:
            player.setVelocityX(-160)
            break;
            case this.keys.right.isDown:
            player.setVelocityX(160)
            break;
            default:
            player.setVelocityX(0);
            break;
        }
         player.setVelocityY(160);
        
         player.anims.play('right', true);
     }
    else //complete idle
    {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('knight_idle',true);
    }

    
}
}


module.exports = BootScene;

