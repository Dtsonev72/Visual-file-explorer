const Phaser=require('phaser')
//The Monster Class
//Extends a sprite object
class Monster extends Phaser.GameObjects.Sprite{
       //Constructs the sprite
        constructor(scene,x,y,file){
            super(scene,x,y,file);
            //Creates a name, hp, maxhp, directory, create and modified time as attributes
            this.fileName=file.name;
            this.hp=file.size;
            this.maxhp=file.size;
            this.directory=file.directory;
            this.createTime=file.createTime;
            this.modifyTime=file.modifyTime;
           
            //passes the scene as an attribute
            this.scene=scene;
            //Adds the hp bar above the monster sprite
            this.hpdecor=scene.add.image(x,y-15,'hpdecor').setScale(0.5);
            this.bar=scene.add.image(x+3,y-15,'hpbar')
            this.bar.setScale(0.5);
           
            //Adds the name of the file below monster
            this.label=this.scene.make.text({
                x:this.x-15,
                y:this.y+18,
                text:formatName(file.name),
                align:'center',
                style:{
                    
                    fontSize:"7px",
                    resolution:7
                }
            })
            //Aligns it and formats
            this.label.setAlign('center')
            this.label.setStroke('rgb(0, 0, 0)',1)
            //Adds the monster to the main scene
            scene.physics.world.enable(this);
            scene.add.existing(this);
            

          
        }
    //function to reduce the hp bar    
    updateBar(damage)
    {   //gets the percent of the decrease 
        const percent=damage/this.maxhp;
        //decreases the current hp
        this.hp-=damage;
        //reduces the width of the hpbar by that percent
        this.bar.width=this.bar.width-(49*percent);
        //crops it that much
        this.bar.setCrop(0,0,this.bar.width,17)
    }

    //removes the sprite with it's attributes
    remove()
    {
        this.hpdecor.destroy();
        this.bar.destroy();
        this.label.destroy();
        this.destroy();
    }

    //prints out the info of the monster
    info()
    {   
        //if it isn't a directory
        if(this.directory===false)
        {
        //adds a rectangle above it
        const rect=this.scene.add.rectangle(this.x,this.y-31,170,25,0x000000)
        rect.setAlpha(0.07)//opacity 
       
        //adds text inside the rectangle
        const stats=this.scene.make.text({
            x:this.x-80,
            y:this.y-45,
            text:"Size:"+this.maxhp+" Bytes\nCreation Time:"+this.createTime.toString().split(" ",5).join(' ')+"\nModified Time:"+this.modifyTime.toString().split(" ",5).join(' '),
            style:{
                
                fontSize:"7px",
                resolution:10
            }
        })

        //have to set the stroke and the alignment
        stats.setStroke('rgb(0, 0, 0)',2)
        stats.setAlign('center')
        //after a specified time it removes the stats above
        this.scene.time.delayedCall(300, ()=>
          {
            stats.destroy();
            rect.destroy();
           
          });
        }

        //If it is a folder
        else
        {
        //Adds the stats of it above the folder
        const stats=this.scene.add.text(this.x-10,this.y-30,"Folder",{fontSize:"7px",resolution:7})
        this.scene.time.delayedCall(300, ()=>
          {
            stats.destroy();
          });
        }
    }
}

//Function to format the name of the folder/files underneath the monsters
function formatName(str)
{   let newStr="";
    let i=0;
    //Every 7 characters it adds a newline char
    if(str.length > 7)
    {
       while(i<str.length)
       {
           newStr=newStr+str.slice(i,i+6)+'\n'+str.slice(i+6,i+13)+'\n';
           i=i+13;
        } 
    
    return newStr;
    }
    else
    {
        return str;
    }
    
}


module.exports =Monster;
