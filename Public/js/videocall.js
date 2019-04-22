var socket = io();
var receive = document.getElementById('userid').value;
var sendir ;
var peerConnection = new RTCPeerConnection();
var remotevideo = document.getElementById('remotevideo');
var video = document.getElementById('video');
var notification = document.getElementById('notification');
var pcld;



var accept = false;
var caller=false;

const config = {
    'iceServers': [{
        'urls': ['stun:stun.l.google.com:19302']
    }]
}
var peerConnection = new RTCPeerConnection(config);
peerConnection.onicecandidate = function (event) {
    if (event.candidate) {
        console.log('can');
        socket.emit('candidate', event.candidate);
  }
}

socket.on('candidate', function (candidate) {
    const c = new RTCIceCandidate(candidate);
    console.log('candidare ice');
    peerConnection.addIceCandidate(c);
});




socket.on('offer' + receive, function (msg,call) {
    console.log('offer socket')
    console.log(call);
    
    sendir=call
    
    peerConnection.setRemoteDescription(msg).
    then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(function () {
            pcld: peerConnection.localDescription
            console.log(pcld);



        })
        .catch((err) => {
            console.log(err);
        });
    if (accept === false) {
        notification.play();
        $('#callmodel').modal();
        

    }


});





socket.on('endcall' + receive, function () {
    console.log('now enter')
    if (accept === true) {
        accept = false
        console.log('endcall');
        $('#mymodel').modal('hide');
        endcall();



    }
    if (accept === false) {
        $('#callmodel').modal('hide');

        notification.pause();
        notification.currentTime = 0.0;
        sendir ='';
    }

})






function Accepted() {
    notification.pause();
    notification.currentTime = 0.0;
    
    socket.emit('answer', {
        peerConnectionlocalDescription: peerConnection.localDescription,
        id: 'answer' + sendir
    });
    accept = true;
    
    $('#mymodel').modal();
    call();



}






peerConnection.onaddstream = function (event) {
    console.log('inside the ontrack');
    remotevideo.srcObject = event.stream;

}




function call() {


    accept = true;
    navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        .then(function (stream) {
            video.srcObject = stream;
            console.log('1')
            peerConnection.addStream(stream);
            console.log('3')
            peerConnection.createOffer()
                .then(function (sdp) {
                    console.log('3')
                    peerConnection.setLocalDescription(sdp)
                })
                .then(function () {
                    console.log('4')
                    socket.emit('offer', {
                        peerConnectionlocalDescription: peerConnection.localDescription,
                        id: 'offer' + sendir,
                        receiverid:receive
                    });
                })
        })
        .catch(function (error) {
            console.log(error);
            console.log("Something went wrong!");
        });
        if(second===true)
        {
        peerConnection = new RTCPeerConnection(config);
        second=false;
        }
}





function endc() {
    notification.pause();
    notification.currentTime = 0.0;

    socket.emit('endcall', {
        id: 'endcall' + sendir
    });
     sendir = document.getElementById('pathuser').value
    peerConnection = new RTCPeerConnection(config);
    peerConnection.onaddstream = function (event) {
    console.log('inside the ontrack');
    remotevideo.srcObject = event.stream;

}
}




function endcall() {

    var remotevideo = document.getElementById('remotevideo');
    var video = document.getElementById('video');
    let stream = video.srcObject;
    let tracks = stream.getTracks();


    tracks.forEach(function (track) {
        track.stop();
    });


    video.srcObject = null;
    remotevideo.srcObject=null;

     
    if (accept === true) {

        socket.emit('endcall', {
            id: 'endcall' + sendir
        });
        accept = false;
        sendir =''
    }
    sendir ='';
    peerConnection = new RTCPeerConnection(config);
    peerConnection.onaddstream = function (event) {
    console.log('inside the ontrack');
    remotevideo.srcObject = event.stream;

}
     

}



socket.on('connect', function (s) {

    console.log('connected client')




});

socket.on('disconnect', function () {
    console.log('Disconnected from server')
});
