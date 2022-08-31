import fs from "fs";
import Jimp = require("jimp");
import axios from 'axios'

export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo:Jimp = await axios({
        method: 'get',
        url: inputURL,
        responseType: 'arraybuffer'
      })
      .then(function ({data: imageBuffer}) {
        return Jimp.read(imageBuffer)
      });
      const outpath = "/tmp/filtered-" + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  let deletedFilesCount:number = 0
  for (let file of files) {
    try{
      fs.unlinkSync(file);
      deletedFilesCount += 1
    }catch(error){}
  }
  let message:string = deletedFilesCount?"Successfully delete":"No file to delete"
  return message
}
