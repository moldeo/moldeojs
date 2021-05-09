
import {map} from 'rxjs/operators';
import { Injectable,  Inject, Optional } from '@angular/core';

import { Subject ,   BehaviorSubject }    from 'rxjs';
//import { Http } from "@angular/http";

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

@Injectable({
  providedIn: 'root'
})
export class Logger {
  logs: string[] = []; // capture logs for testing

  log(message: string) {
    this.logs.push(message);
    console.log(message);
  }
}

@Injectable()
export class SocketOne extends Socket {

    constructor() {
        super({ url: 'https://speak.moldeo.org:8989', options: {} });
    }

}

@Injectable()
export class CollaborativeService {

    socket: SocketOne = undefined
    Channels : any;

    constructor(@Optional() private logger?: Logger) {
      //this.socket = new SocketOne();
    }

    getSocket() : Socket {
      return this.socket;
    }

    sendMessage(data) {
        //console.log("CService > sendMessage() emitting message",data);
        var data : any = { msg: data.msg, options: data.options }
        if (this.socket)
          this.socket.emit("message", data );
    }

    getMessage() {
        console.log("CollService > getMessage() receiving message");
        if (this.socket)
          return this.socket
                  .fromEvent<any>("message").pipe(
                    map(data => data ));
    }

    updateClient() {
      if (this.socket)
        return this.socket
          .fromEvent<any>("update_client").pipe(
          map(data => data ));
    }

    fetchClients() {
      console.log("CollService::fetch clients");
      if (this.socket)
        this.socket.emit("list_clients" );
    }

    sendClient( data : any ) {
      //console.log("Send client data",data);
      if (this.socket)
        this.socket.emit("client_data", data );
    }

    getClients() {
        console.log("CollService::getting clients count");
        if (this.socket)
          return this.socket
            .fromEvent<any>("clients").pipe(
            map(data => data.clients ));
    }

    getListClients() {
        //console.log("Listing clients");
        if (this.socket)
          return this.socket
            .fromEvent<any>("list_clients").pipe(
            map(data => data ));
    }

    Connected() {
        console.log("CollService::Connected");
        if (this.socket)
          return this.socket
            .fromEvent<any>("connected").pipe(
            map(data => data ));
    }

    Disconnected() {
        console.log("CollService::Disconnected");
        if (this.socket)
          return this.socket
            .fromEvent<any>("disconnected").pipe(
            map(data => data ));
    }

    close() {
      if (this.socket)
        this.socket.disconnect()
    }
}
