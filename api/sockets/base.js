var sockets = require('../config/sockets/socket');


module.exports = function (io,client) {


  io.on('connection', function (socket) {

    // HOME

      socket.on('connectionName', function (data, fn) {
        var obj = {id:socket.id,name:data.name, tipo:0};

        client.hmset(socket.id,obj);
        socket.broadcast.emit('connectionUser',obj);
        fn(obj);

        return;
      });

    // ROOM

      socket.on('beginGame', function (data, fn) {
        client.hmset(data.chose.id, {id:data.chose.id,name:data.chose.name, tipo:data.begin.id});
        client.hmset(data.begin.id, {id:data.begin.id,name:data.begin.name, tipo:data.chose.id});
        io.sockets.connected[data.chose.id].emit('gameBegin',data);
        socket.broadcast.emit('disconnectionUser',{id:data.chose.id,name:data.chose.name, tipo:data.begin.id});
        socket.broadcast.emit('disconnectionUser',{id:data.begin.id,name:data.chose.name, tipo:data.chose.id});
        
        fn(data);

        return;
      });

    // GAME

      socket.on('disconnectUser', function (data, fn) {
        client.del(data.id);
        if(data.tipo!==0){
          io.sockets.connected[data.tipo].emit('gameDisconnect',data);
          client.hgetall(data.tipo, function(err, val) {
            if(val){
              client.hmset(val.id, {id:val.id,name:val.name, tipo:0});
              socket.broadcast.emit('connectionUser',{id:val.id,name:val.name, tipo:0});
            }
             
          });
        }
        socket.broadcast.emit('disconnectionUser',data);

        fn(data);

        return;
      });

      socket.on('move', function (data, fn) {
        
        io.sockets.connected[data.adversary.id].emit('move2',data);
        if(data.end){
          client.hmset(data.adversary.id, {id:data.adversary.id,name:data.adversary.name, tipo:0});
          socket.broadcast.emit('connectionUser',{id:data.adversary.id,name:data.adversary.name, tipo:0});
          client.hmset(data.user.id, {id:data.user.id,name:data.user.name, tipo:0});
          socket.broadcast.emit('connectionUser',{id:data.user.id,name:data.user.name, tipo:0});
        }
        fn(data);

        return;
      });

      socket.on('specialMove', function (data, fn) {
        if(data.move=="draw") {
          io.sockets.connected[data.adversary.id].emit('toDraw',data);
        }else{
          if(data.move==="resign"){
              data.evento = 1;
              
          }else if(data.move=="toDraw"){
              data.evento = 2;
          }else if(data.move=="time"){
              data.evento = 3;
          }
          io.sockets.connected[data.adversary.id].emit('gameDisconnect',data);
            client.hgetall(data.adversary.id, function(err, val) {
              if(val){
                client.hmset(val.id, {id:val.id,name:val.name, tipo:0});
                socket.broadcast.emit('connectionUser',{id:val.id,name:val.name, tipo:0});
              }
               client.hgetall(data.user.id, function(err, val) {
                if(val){
                  client.hmset(val.id, {id:val.id,name:val.name, tipo:0});
                  socket.broadcast.emit('connectionUser',{id:val.id,name:val.name, tipo:0});
                }
                fn(data);
              });
          });

        }
        
        
        return;
      });

    // DISCONNECT

      socket.on('disconnect', function () {
        client.hgetall(socket.id, function(err, value) {
            if(value&&value!==null){
              socket.broadcast.emit('disconnectionUser',value);
              if(value.tipo!==0){
                if(io.sockets.connected[value.tipo]){
                  io.sockets.connected[value.tipo].emit('gameDisconnect',value);
                  client.hgetall(value.tipo, function(err, val) {
                    if(val){
                      client.hmset(val.id, {id:val.id,name:val.name, tipo:0});
                      socket.broadcast.emit('connectionUser',{id:val.id,name:val.name, tipo:0});
                    }
                  });
                } 
              }
              client.del(socket.id);
            }
            return;
        });
      });


  });

      
};