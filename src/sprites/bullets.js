const Phaser=require('phaser')
//Constant for the bullet speed
const BULLET_SPEED=300;
//Makes an image class for the bullets
class Bullet extends Phaser.GameObjects.Image{
        //Constructs in the current scene
        constructor(scene){
            super(scene);
            //Gets the Image from the previous scene that was preloaded
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
            this.setScale(0.4);//scale it down
            //keeps track of how long it is born
            this.born = 0;
            //Adds it to the scene
            scene.physics.world.enable(this);
            scene.add.existing(this);
                        
          
        }
    
     //Fire function to calculate the trajectory of the bullet
     fire(player,pointer) {
        //Start the position at the player coordinates
        this.setPosition(player.x, player.y); 

        //Gets the angle between for the X and Y coordinates of the click
        const direction = Math.atan( (pointer.x-this.x) / (pointer.y-this.y));

        if (pointer.y > this.y) //If it is in the upper coordinate plane

        {   //Gets the ratio needed to calculate the X and Y vectors for the velocity
            //this is needed so that it keeps the bullet speed constant
            this.body.setVelocityX(BULLET_SPEED*Math.sin(direction));
            this.body.setVelocityY(BULLET_SPEED*Math.cos(direction));
        }
        else
        {
            //Gets the ratio needed to calculate the X and Y vectors for the velocity
            //this is needed so that it keeps the bullet speed constant
            this.body.setVelocityX(-(BULLET_SPEED*Math.sin(direction)));
            this.body.setVelocityY(-(BULLET_SPEED*Math.cos(direction)));
        }
        
        
        
            
    }
    //to delete the bullet after a certain time
    update (time,delta)
    {
        //adds it to the born
        this.born += delta;

        if (this.born > 1200)
        {   //disables the bullet
            this.setActive(false);
            this.setVisible(false);
        }
    }

}


module.exports =Bullet;
