//Set up a constant for bullet damage
const BULLET_DAMAGE=1000;
const fileFuncs=require('./files');
const path=require('path');
//create a module exports object with functions
module.exports={
//sets the tint of a sprite to a hex value
tintSetter:function(sprite,hex)
{
  sprite.setTint(hex);
},

//Loads all of the animations of the spritesheets
loadAnims:function(scene)
{
    //Create the animations for the door opening
    scene.anims.create({
          key: 'door_open',
          frames: scene.anims.generateFrameNumbers('door', { start: 1, end: 1 }),
          frameRate: 2,
          repeat: 0
      })
    //The animation for the files
    scene.anims.create({
        key: 'demon_idle',
        frames: scene.anims.generateFrameNumbers('demon', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
      })
    //The animations for the folders
    scene.anims.create({
        key: 'zombie_idle',
        frames: scene.anims.generateFrameNumbers('zombie', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
    })
    //The animation for running left for the knigt
    scene.anims.create({
      key: 'left',
    
      frames: scene.anims.generateFrameNumbers('knight', { start: 5 , end: 8 }),
      frameRate: 10,
      repeat: -1
    });
    //The animation for standing still for the knight
    scene.anims.create({
      key: 'knight_idle',
      frames: scene.anims.generateFrameNumbers('knight',{start:0,end:2}) ,
      frameRate: 5,
      repeat:-1
    });
    //The animation for running right for the knight
    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('knight', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    })
},


//Creates a player
createPlayer:function(scene,x,y,name)
{   
   //adds the sprite to the scene
   player=scene.physics.add.sprite(x,y,name);
   return player;
},

// createEnemy:function(scene)
// {

// },

//Damaging the enemy
damageEnemy: function(enemy, bullet,dir) {  
  // only if both enemy and bullet are alive
  if (enemy.active === true && bullet.active === true) {
      // we remove the bullet right away
      bullet.destroy();
      
      // decrease the enemy hp with BULLET_DAMAGE
      receiveDamage(enemy,BULLET_DAMAGE,dir);
  }
}

}

//The function is used to decrease the hp of the enemy
function receiveDamage (enemy,damage,dir)
{
    enemy.updateBar(damage);//Visually decreases the hp bra
    if(enemy.hp <= 0) {
        if(enemy.directory===true)
        {
          fileFuncs.deleteDir(path.join(dir,enemy.fileName))
        }
        else if(enemy.directory===false)
        {
          fileFuncs.deleteFile(path.join(dir,enemy.fileName))
        }
      //cleans up the enemies that killed
      enemy.remove();
         
  }
}