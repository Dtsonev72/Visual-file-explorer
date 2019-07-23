const fs=require('fs');
const path=require('path')
const fsUtils = require("nodejs-fs-utils");


//creates a module exports object
module.exports={

    //Gets the files in the directory
    getFile: function(newPath){
    //initializes an array of files
    let arr=[];
    try
    {
    //reads the directory with files
    const dir=fs.readdirSync(newPath);
    
    //Iterates through the files
    dir.forEach(file=>{
        //gets the stats for each file
        const stats=fs.statSync(path.join(newPath,file))
        //if it is a directory
        if(stats.isDirectory()){
            //Put an element in the array with a set size for the folder
            arr.push({
                    size:10000,
                    directory:true,
                    name:file,
                    createTime:stats["birthtime"],
                    modifiedTime:stats["mtime"]

                });

        }

        else{
            //Else it is a file and get the attributes for the file
            //push it in the array
            arr.push(
            {
                size:stats["size"],
                directory:false,
                name:file,
                createTime:stats["birthtime"],
                modifyTime:stats["mtime"]
            })
        }
                                
        
    })
    }
    //error catching
    catch(e)
    {
        console.log(e)
    }
    return arr;
},

//Deletes a file
deleteFile: function (file)
{
    try{
    fs.unlinkSync(file);
    }
    catch (e)
    {
        console.log(e);
    }
},

//Create a file
createFile:function (file,data)
{   try{
    fs.appendFileSync(file, data);
    }
    catch(e)
    {
        console.log(e);
    }
    
},

//Moves a file from a source path into a destination file
moveFile:function (src,dest)
{
    
    try{
    //I copy the file over to the destination then delete it
    fs.copyFileSync(src,dest);
    fs.unlinkSync(src);
    }
    catch(e)
    {
        console.log(e);
    }
 
},
//Copy a file
copyFile: function (currDir,pasteDir)
{
    try{
    fs.copyFileSync(currDir,pasteDir);
    }
    catch(e)
    {
        console.log(e);
    }
},
//Deletes a directory
deleteDir:function (dir)
{   try{
    fsUtils.rmdirsSync(dir)
    }
    catch(e)
    {
        console.log(e);
    }
},
//Creates a directory
createDir:function (dir)
{
    try{
    fs.mkdirSync(dir)
    }
    catch(e)
    {
        console.log(e);
    }
}

}



