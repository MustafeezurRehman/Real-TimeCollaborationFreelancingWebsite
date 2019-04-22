const mongoose = require('mongoose');
var app = require('./app.js');
var http = require('http');
var server = http.createServer(app);
var socketIO = require('socket.io');
var io = socketIO(server);
io.on('connection', (socket) => {

    console.log('connected');
    socket.on('message', function (data) {

        console.log(data);
        socket.broadcast.emit(data.RECEIVERID, data);


    });

    socket.on('videocall', function (data) {
        console.log('video call');
        socket.broadcast.emit(data.RECEIVERID, data);

    })
    socket.on('offer',function(data)
    {
        
        socket.broadcast.emit(data.id,data.peerConnectionlocalDescription,data.receiverid);
    });
    socket.on('answer',function(data)
    {
        socket.broadcast.emit(data.id,data.peerConnectionlocalDescription);
    });
    socket.on('candidate',function(data)
    {
        socket.broadcast.emit('candidate', data);
    });
    socket.on('endcall',function(data)
    {
        socket.broadcast.emit(data.id);
    });
    

})



exports.io = io;




//applling Global promice to Mongoose promise
mongoose.Promise = global.Promise;

//connet with Mongodb
mongoose.connect('mongodb://localhost:27017/Hire&work', {
    useNewUrlParser: true
});
mongoose.connection
    .once('open', () => console.log('Database Connected'))
    .on('error', (err) => console.log(err));






const port = process.env.Port || 3000;
server.listen(port, () => console.log(`Server Running on Port ${port}`));