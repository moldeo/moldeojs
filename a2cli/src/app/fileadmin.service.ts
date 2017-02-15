import { Injectable } from '@angular/core';
export const fs : any = window["fs"];
export const http : any = window["http"];

@Injectable()
export class FileAdminService {
 constructor() { }

 //////////DOWNLOAD FILE/////////
 downloadFile(url, path, name, ext){
   var file : any = fs.createWriteStream(path+"/"+name+"."+ext);
   var request = http.get(url, function(res) {
      res.pipe(file);
      file.on('finish', function() {
        file.close();
      });
   });
  }

  //////////DELETE ALL CONTENT FROM DIRECTORY/////////
  deleteAllContentFrom(path) {
    if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) {
          this.deleteAllContentFrom(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
    }
  }

  //////////DELETE DIRECTORY/////////
  deleteDirectory(path) {
    this.deleteAllContentFrom(path);
    if( fs.existsSync(path) ) {
      fs.rmdirSync(path);
    }
  }

  //////////READ DIRECTORY/////////
  readDirectory(path) {
    fs.readdir(path, (err, files) => {
      files.forEach(file => {
        console.log(file);
      });
    })
  }

}
