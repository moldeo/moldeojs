import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import 'rxjs/Rx';

@Injectable()
export class JsonService {
 constructor(private http: HttpClient) { }

 //////////GET JSON CONTENT//////////
 getJson(url) {
  return this.http.get(url).map((res) => res);
 }

 //////////GET OBJECTS FILTER BY KEY & VALUE//////////
 getObjectsFilterBy(data, key, val){
  var objects = [];
  var index = -1;

  for(var i = 0; i < data.length; i++){
    if(data[i][key] === val){
      index = index + 1;
      objects[index] = data[i];
    }
  }

  if(objects.length > 0){
    return objects;
  }else{
    return null;
  }
 }

 //////////GET DATA FILTER BY KEY & VALUE//////////
 getDataFilterBy(data, key){
   var datas = [];
   var index = -1;

   for(var i = 0; i < data.length; i++){
    if(data[i][key] !== undefined){
      index = index + 1;
      datas[index] = data[i][key];
    }
   }

   if(datas.length > 0){
     return datas;
   }else{
     return null;
   }
 }

 /*getValuesFilterBy(data, key){
    var datas = [];
    var index = -1;

    for(var i = 0; i < Object.keys(data).length; i++){
      if(Object.keys(data)[i] !== undefined){
        if(Object.keys(data)[i] == key){
          index = index + 1;
          datas[index] = data[Object.keys(data)[i]];
        }
      }
    }

    if(datas.length > 0){
     return datas;
    }else{
     return null;
    }
  }*/

}
