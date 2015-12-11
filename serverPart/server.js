var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 7000));
// app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname,'client')));
var server = app.listen(app.get('port'), function() {
	console.log("stoke at port: 7000")
});
var hostpital = { 
	strokeCenter: [{
			key: "UW",
			name: "UW Medicine/Northwest",
			available: "false"},
			{
			key: "VMMC",
			name: "Virginia Mason Medical Center",
			available: "false"
		}, {
			key: "SMC",
			name: "Swedish Medical Center",
			available: "false"
		}, {
			key: "SMCCH",
			name: "Swedish Medical Center/Cherry Hill",
			available: "false"
		}, {
			key: "HMC",
			name: "Harborview Medical Center",
			available: "false"
		}
	]
}
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
	console.log("socket connected ", socket.id);
	socket.on("requestSent", function(data){
		data.socketID = socket.id;
		console.log("request sent", data);
		socket.broadcast.emit('thereWasRequest', data);
	});
	socket.on("responseForRequest", function(data){
		console.log("response for request ", data)
		var embSocket = data.socketID;
		if (io.sockets.connected[embSocket]){
			console.log("emitting")
			io.sockets.connected[embSocket].emit('hospitalResponse', data)
		}
	});

// 	console.log("socket connected", socket.id);
// 	socket.on("startedChat", function(data){
// 		console.log(data)
// 		users.find(data, socket);
// 		// var xxx = "chris"
// 		// console.log(receiver);
// 		// io.sockets.emit('receiver',xxx);
// 	});
// 	socket.on('updateSocketID', function(data){
// 		data.cSocketID = socket.id;
// 		console.log(data, "data");
// 		users.updateSocketID(data, function(){
// 			for (var friend = 0; friend < data.friends.length; friend++){

// 				if (data.friends[friend].cSocketID){
// 					var friendSocketID = data.friends[friend].cSocketID;
// 					console.log("emitting to friend", friendSocketID)
// 					if (io.sockets.connected[friendSocketID]){
// 						console.log("emitting")
// 						io.sockets.connected[friendSocketID].emit('updateFriendList', data)
// 					}
// 				}
// 				console.log(1, data.friends[friend].cSocketID, friend, data.friends.length)
// 			}
// 		});

// 	});
// 	socket.on('disconnect', function(){
// 		users.disconnectSocket(socket.id);
// 	});
// 	socket.on('sendMessageToServer', function(data){
// 		console.log("sendmessage",data,"from socket id ",socket.id)
// 		if(data.sendTo){
// 			if (io.sockets.connected[data.sendTo]){
// 				console.log("really emitting the message to ", data.sendTo)
// 				io.sockets.connected[data.sendTo].emit('message', data);
// 			}
// 		}

// 	})
})