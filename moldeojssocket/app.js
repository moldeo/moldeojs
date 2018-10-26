var http = require('http');
var https = require('https');
var path = require('path');
var express = require('express');
var app = express();
var fs = require("fs");



app.use(express.static(path.join(__dirname, 'public/dist')));

app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });

app.get('*', function(req, res, next) {
  res.sendFile(__dirname+"/public/dist/index.html");
});

var secure = false;
//var key = fs.readFileSync('privkey.pem');
//console.log(key);
var server = {}
if (secure) {
 server = https.createServer(
  {
                  key: fs.readFileSync('privkey.pem'),
                  cert: fs.readFileSync('cert.pem'),
                  requestCert: false,
                  rejectUnauthorized: false
               },
  app);
} else {
 server = http.createServer(app);
}
var io = require('socket.io')(server);


var IoClient = {
  id : false,
  number: 0,
  color: "",
  state: "",
  avatar: false,
};

//io.set("transports", ["xhr-polling","websocket","polling", "htmlfile"]);
var database = {

  //clients indexed by ID
  //LIST
  clients: {},

  //clients indexed by order
  //ARRAY
  clientsA:[],
}
io.set( 'origins', '*:*' );
io.on('connection', function (socket) {
    console.log("One user is connected: ",socket.client.conn.id);
    console.log("Clients:",socket.server.engine.clientsCount);

    database.clients[socket.client.conn.id] = {
      id: socket.client.conn.id,
      number: database.clientsA.length,
      state: 'connected',
    };
    database.clientsA.push({ id: socket.client.conn.id });
    /*
    for( client in socket.server.engine.clients ) {
      console.log(client);
    }
    */

    /**
      Good welcome to Speak chat online !!!

      Send to the connected a welcome message .
      Send to the connected the user count as "clients".
      Broadcast to all connected the new user count, also as "clients"

      Register the connected to the 'message' messages.


    */
    //Send to the connected a welcome message .
    socket.emit('message', {
          msg: 'Speak Imaginación Colectiva',
          options: {
            id: socket.client.conn.id,
            state: "welcome"
          }
        });
    socket.emit('connected', database.clients[socket.client.conn.id] );
    //Send to the connected the user count as "clients".
    socket.emit('clients', { clients: socket.server.engine.clientsCount });
    //Broadcast to all connected the new user count, also as "clients"
    socket.broadcast.emit('clients', { clients: socket.server.engine.clientsCount });
    //Broadcast to all connected the new user id
    database.clients[socket.client.conn.id]["state"] = "user connected";
    socket.broadcast.emit('connected', database.clients[socket.client.conn.id] );

    socket.on('client_data',function(data) {
        if (database.clients[data.id]) {
            for(let k in data) {
              database.clients[data.id][k] = data[k];
            }
        } else {
          database.clients[data.id] = data;
          database.clientsA.push({ id: data.id });
        }
        socket.broadcast.emit('update_client', database.clients[data.id]);
    });

    socket.on('list_clients',function(data) {
      socket.emit('list_clients', {
        clients: socket.server.engine.clientsCount,
        list: database.clients
       });
    });

    socket.on('update_client',function(data) {
      data.received = "ok";
      //socket.emit('update_client', data);
    });

    //Server listen to messages to deliver.
    // 1. re-emits an ok to the sender
    // 2. re-emits to all non senders (broadcast)
    socket.on('message',function(data) {

      //
      console.log(socket.client.conn.id+" message rec",data);

      /* COMPLETE DATA FOR THIS MESSAGE TO BE RELEASE */
      data.options = data.options || {}
      data.options["source_id"] = socket.client.conn.id;
      data.options["number"] = database.clients[socket.client.conn.id]["number"];

      //UPDATE COLOR
      if (data.options["color"]) {
        database.clients[socket.client.conn.id]["color"] = data.options["color"];
      }
      //Send ok! to the sender
      data.options["server_message"] = "sent_ok";

      socket.emit('message', {
        msg: data.msg,
        options: data.options
      });

      //Send to all others the same message.
      data.options["server_message"] = "new_message";

      socket.broadcast.emit('message', {
        msg: data.msg,
        options: data.options
      });

    })


    socket.on('disconnected',function(){
      console.log("Disconnected ",socket.client.conn.id );
      console.log("Clients:",socket.server.engine.clientsCount);
      socket.broadcast.emit('clients', { clients: socket.server.engine.clientsCount });
      socket.emit('disconnected', { id: socket.client.conn.id, state: 'disconnected' } );
      socket.broadcast.emit('disconnected', { id: socket.client.conn.id, state: 'user disconnected' } );

      database.clients[socket.client.conn.id]["state"] = "disconnected";
    });
});

server.listen(8988);
