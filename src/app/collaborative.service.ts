
import {map} from 'rxjs/operators';
import { Injectable,  Inject} from '@angular/core';

import { Subject ,   BehaviorSubject }    from 'rxjs';
import { Http } from "@angular/http";

import { moConsole } from './mo-console';
import { moResourceManager } from './mo-resource-manager';
import { moIODeviceManager } from './mo-iodevice-manager';

import { Socket } from 'ngx-socket-io';

export class CollaborativeData {
  msg: string;
  options: any;
};

export class CollaborativeClient {
    id : any = false;
    number: number = 0;
    color: any = "";
    state: any = "";
    avatar: any =  false;
};


@Injectable()
export class CollaborativeService {

    constructor(private socket: Socket) { }
    Channels : any;


    sendMessage(data) {
        //console.log("CService > sendMessage() emitting message",data);
        var data : any = { msg: data.msg, options: data.options }
        this.socket.emit("message", data );
    }

    getMessage() {
        //console.log("CService > getMessage() receiving message");
        return this.socket
            .fromEvent<any>("message").pipe(
            map(data => data ));
    }

    updateClient() {
      return this.socket
          .fromEvent<any>("update_client").pipe(
          map(data => data ));
    }

    fetchClients() {
      //console.log("fetch clients");
      this.socket.emit("list_clients" );
    }

    sendClient( data : any ) {
      //console.log("Send client data",data);
      this.socket.emit("client_data", data );
    }

    getClients() {
        //console.log("getting clients count");
        return this.socket
            .fromEvent<any>("clients").pipe(
            map(data => data.clients ));
    }

    getListClients() {
        //console.log("Listing clients");
        return this.socket
            .fromEvent<any>("list_clients").pipe(
            map(data => data ));
    }

    Connected() {
        //console.log("Connected");
        return this.socket
            .fromEvent<any>("connected").pipe(
            map(data => data ));
    }

    Disconnected() {
        //console.log("Disconnected");
        return this.socket
            .fromEvent<any>("disconnected").pipe(
            map(data => data ));
    }

    close() {
      this.socket.disconnect()
    }
}