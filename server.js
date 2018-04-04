var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = [];
var counter = 0;

server.listen(8080, function(){
  console.log("Server is now running...");
});

io.on('connection', function(socket){
  console.log("Player Connected!");
  players.push(new player(0, 0));
  socket.emit('socketID', { id: socket.id });
  socket.emit('getPlayers', players);

  if(players[0].id == 0){
  players[0].id = socket.id;
  }
  else if(players[1].id == 0){
    players[1].id = socket.id;
  }
  else{
    console.log("error adding socket id")
  }

  if(players.length == 2){
    randomNumberFunction();
  }

 function randomNumberFunction(){
      var random = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    return random;
 }


  socket.broadcast.emit('newPlayer', { id: socket.id });
  socket.on('disconnect', function(){
    console.log("Player Disconnected");
    socket.broadcast.emit('playerDisconnected', { id: socket.id });

    for(var i = 0; i <= players.length; i++){
        players.splice(i, 1);
    }

  });

  socket.on("getRandomNumber", function(){
    
      if(socket.id == players[0].id){
      var random = randomNumberFunction();
      socket.emit("randomNumber", {rand: random});
        socket.broadcast.emit("randomNumber", {rand: random});
    }
  });



  socket.on("playerTime", function(data){
    counter++;
  
    if(socket.id == players[0].id){
          players[0].playerScore = data.playerTimes;
          socket.broadcast.emit("playerTime", {playerTimes: data.playerTimes});
    }else if(socket.id == players[1].id){
        players[1].playerScore = data.playerTimes;
          socket.broadcast.emit("playerTime", {playerTimes: data.playerTimes});
    }else{
      console.log("Error adding score");
    }

  

      if(counter >= 2){


              if(players[0].playerScore > players[1].playerScore && players[0].id == socket.id){
               loser();
         counter = 0;
         }
                else if(players[0].playerScore < players[1].playerScore && players[0].id == socket.id){
                winner();
                counter = 0;
                 }
                else if(players[1].playerScore > players[0].playerScore && players[1].id == socket.id){
                loser();
                counter = 0;
                 }
                else if(players[1].playerScore < players[0].playerScore && players[1].id == socket.id){
                winner();
                counter = 0;
                }
                else{
                console.log("Error emitting score");
                  }

        }

      function winner(){
        socket.broadcast.emit("playerScore", {playerScore: "loser"});
        socket.emit("playerScore", {playerScore: "winner"});
      }

      function loser(){
       socket.broadcast.emit("playerScore", {playerScore: "winner"});
       socket.emit("playerScore", {playerScore: "loser"});
      }

  });


});

function player(id, playerScore){
  this.id = id;
  this.playerScore = playerScore;
};

//  OpenShift sample Node application
// var express = require('express'),
//     app     = express(),
//     morgan  = require('morgan');
    
// Object.assign=require('object-assign')

// app.engine('html', require('ejs').renderFile);
// app.use(morgan('combined'))

// var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
//     ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
//     mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
//     mongoURLLabel = "";

// if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
//   var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
//       mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
//       mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
//       mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
//       mongoPassword = process.env[mongoServiceName + '_PASSWORD']
//       mongoUser = process.env[mongoServiceName + '_USER'];

//   if (mongoHost && mongoPort && mongoDatabase) {
//     mongoURLLabel = mongoURL = 'mongodb://';
//     if (mongoUser && mongoPassword) {
//       mongoURL += mongoUser + ':' + mongoPassword + '@';
//     }
//     // Provide UI label that excludes user id and pw
//     mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
//     mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

//   }
// }
// var db = null,
//     dbDetails = new Object();

// var initDb = function(callback) {
//   if (mongoURL == null) return;

//   var mongodb = require('mongodb');
//   if (mongodb == null) return;

//   mongodb.connect(mongoURL, function(err, conn) {
//     if (err) {
//       callback(err);
//       return;
//     }

//     db = conn;
//     dbDetails.databaseName = db.databaseName;
//     dbDetails.url = mongoURLLabel;
//     dbDetails.type = 'MongoDB';

//     console.log('Connected to MongoDB at: %s', mongoURL);
//   });
// };

// app.get('/', function (req, res) {
//   // try to initialize the db on every request if it's not already
//   // initialized.
//   if (!db) {
//     initDb(function(err){});
//   }
//   if (db) {
//     var col = db.collection('counts');
//     // Create a document with request IP and current time of request
//     col.insert({ip: req.ip, date: Date.now()});
//     col.count(function(err, count){
//       if (err) {
//         console.log('Error running count. Message:\n'+err);
//       }
//       res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
//     });
//   } else {
//     res.render('index.html', { pageCountMessage : null});
//   }
// });

// app.get('/pagecount', function (req, res) {
//   // try to initialize the db on every request if it's not already
//   // initialized.
//   if (!db) {
//     initDb(function(err){});
//   }
//   if (db) {
//     db.collection('counts').count(function(err, count ){
//       res.send('{ pageCount: ' + count + '}');
//     });
//   } else {
//     res.send('{ pageCount: -1 }');
//   }
// });

// // error handling
// app.use(function(err, req, res, next){
//   console.error(err.stack);
//   res.status(500).send('Something bad happened!');
// });

// initDb(function(err){
//   console.log('Error connecting to Mongo. Message:\n'+err);
// });

// app.listen(port, ip);
// console.log('Server running on http://%s:%s', ip, port);

// module.exports = app ;
