//Loads phaser 3
const Phaser = require('phaser');
//Loads both of our scenes
const BootScene= require('./scenes/boot-scene.js');
const PreloadScene= require('./scenes/preload-scene.js');

//Initialization of configuration of the game
const config = {
  //Uses WebGL or Canvas to place the graphics
  type: Phaser.AUTO,
    width: 1200,
    height: 800,
    //If pixel art is true then make the pixels crisper
    pixelArt:true,
    //resolution to make the text crisp
    resolution:8,
    //Physics definition
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x:0 },
            debug: false
        }
    },
  //Loads the scenes in order
  scene: [PreloadScene,BootScene]
  
};

//configures the game
const game = new Phaser.Game(config);
