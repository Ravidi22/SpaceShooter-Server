class OnlineUser {
  constructor(socket, name){
    this.socket = socket,
    this.Name = name;
    this.FreeToPlay = true;
    this.Points = 0;
    this.IsUserLost = false;
  }
}

const database = require("./Database")
const http = require('http');
const express = require('express')
const app = express()
const server = http.createServer(app);
const socketio = require('socket.io');
const { Console } = require("console");
const io = socketio(server);

let OnlineUsersList = [];



io.on('connection', (socket) =>{
  socket.on('ReadyToPlay', (name) => {
    const index = OnlineUsersList.findIndex(u => u.Name === name);
    index === -1
      ? OnlineUsersList.push(new OnlineUser(socket, name))
      : (OnlineUsersList[index].FreeToPlay = true);
    UpdateOnlineUsers();
  });
  socket.on("WantToPlay", (requestedGame) =>{
      PlayRequest(JSON.parse(requestedGame));
  });
  socket.on("AgreeToPlay", (requestPlayData) => {
      StartPlayRequest(JSON.parse(requestPlayData));
  });
  socket.on("RefuseToPlay", (refuseData) => {
      RefusePlayRequest(JSON.parse(refuseData));
  });
  socket.on("PlayerDisconnected", (socketId) => {
    OnlineUsersList.splice(OnlineUsersList.findIndex(u => u.socket.id === socketId), 1);
    UpdateOnlineUsers();
  });
  socket.on("UpdatePoints", (playData) => {
    UpdatePoints(JSON.parse(playData));
});
  socket.on("EndGame", (playData) => {
      EndGame(JSON.parse(playData));
  });
});
io.on('disconnect', (socketId) => {
  OnlineUsersList.splice(OnlineUsersList.findIndex(u => u.socket.id === socketId), 1);
    UpdateOnlineUsers();
  });


app.get("/Login", (req, res) => {
  database.CheckLogin(req.query, (user) => {
      res.send(user[0]);
  });
});

app.get("/IsEmailExist", (req,res) => {
  database.IsEmailAlreadyExist(req.query, (result) => {
      res.send(result);
  });
});

app.get("/IsNameExist", (req,res) => {
  database.IsUsernameAlreadyExist(req.query, (result) => {
      res.send(result);
  });
});


app.get("/IsWinner", (req,res) => {
  res.send(JSON.stringify(OnlineUsersList.find(user => user.Name == req.query.RivalName).IsUserLost));
});


app.post("/ResetPassword", (req,res) => {
  database.ResetPassword(req.body);
});

app.post("/AddNewUser", (req, res) => {
  database.AddNewUser(req.body);
});

app.get("/CheckRivalPoints", (req,res) => {
  res.send(JSON.stringify(OnlineUsersList[OnlineUsersList.findIndex(user => user.Name == req.query.RivalName)].Points));
});

const PlayRequest = (requestedGame) => {
  OnlineUsersList.find(u => u.Name == requestedGame.RequestedPlayerName).socket.emit("WantedPlay", requestedGame.RequestingPlayerName)
};

const StartPlayRequest = async (playData) => {
  OnlineUsersList.find(u => u.Name == playData.Player1).socket.emit("StartPlay");
  OnlineUsersList.find(u => u.Name == playData.Player2).socket.emit("StartPlay");
  const index1 = OnlineUsersList.findIndex(u => u.Name == playData.Player1);
  const index2 = OnlineUsersList.findIndex(u => u.Name == playData.Player2); 
  ChangePlayersStatus(index1, index2);
};

const ChangePlayersStatus = (index1, index2) => {
  OnlineUsersList[index1].FreeToPlay = false;
  OnlineUsersList[index2].FreeToPlay = false;
  OnlineUsersList[index1].Points = 0;
  OnlineUsersList[index2].Points = 0;
  OnlineUsersList[index1].IsUserLost = false;
  OnlineUsersList[index2].IsUserLost = false;
};

const RefusePlayRequest = (refuseData) => {
  OnlineUsersList.find(u => u.Name == refuseData.refusedName).socket.emit("RefusedPlay");
};

const UpdatePoints = (playData) => {
  OnlineUsersList.find(u => u.Name == playData.Username).Points = playData.Points;
};

const EndGame = (playData) => {
  OnlineUsersList.find(u => u.Name == playData.Player).IsUserLost = true;
};

const UpdateOnlineUsers = () => {
  for(let index = 0; index < OnlineUsersList.length; index++){
    OnlineUsersList[index].socket.emit("OnlineFreeUsers", OnlineUsersList.filter(user => user.socket.id != OnlineUsersList[index].socket.id && user.FreeToPlay).map(user => user.Name));
  }
};

io.listen(3001);
app.listen(3000, () => {
  console.log("Server started successfully")
});
