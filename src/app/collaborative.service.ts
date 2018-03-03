import { Injectable,  Inject} from '@angular/core';

import { Subject }    from 'rxjs/Subject';
import {  BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { Http } from "@angular/http";

import { moConsole } from './mo-console';
import { moResourceManager } from './mo-resource-manager';
import { moIODeviceManager } from './mo-iodevice-manager';

import { Socket } from 'ng-socket-io';

@Injectable()
export class CollaborativeService {

    constructor(private socket: Socket) { }

    sendMessage(msg: string){
        console.log("emitting",msg);
        this.socket.emit("message", msg);
    }

    getMessage() {
        console.log("getting message");
        return this.socket
            .fromEvent<any>("message")
            .map(data => data.msg );
    }

    getClients() {
        console.log("getting clients");
        return this.socket
            .fromEvent<any>("clients")
            .map(data => data.clients );
    }

    close() {
      this.socket.disconnect()
    }
}
