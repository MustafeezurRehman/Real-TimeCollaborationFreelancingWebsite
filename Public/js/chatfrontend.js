var socket = io();
var receive = document.getElementById('userid').value;
var sendir = document.getElementById('pathuser').value
var peerConnection = new RTCPeerConnection();
var remotevideo = document.getElementById('remotevideo');
var video = document.getElementById('video');
var notification = document.getElementById('notification');
var pcld;
var accept = false;
var caller=false;
scrollToBottom();

/* Video CALL PROTION ****/
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

//broser b
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
        sendir = document.getElementById('pathuser').value
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

//brower A
socket.on('answer' + receive, function (msg) {
    peerConnection.setRemoteDescription(msg);
    console.log('answer socket');

})


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
        sendir = document.getElementById('pathuser').value
    }
    sendir = document.getElementById('pathuser').value
    peerConnection = new RTCPeerConnection(config);
    peerConnection.onaddstream = function (event) {
    console.log('inside the ontrack');
    remotevideo.srcObject = event.stream;

}
     

}


/* end Video CALL PROTION ****/

function scrollToBottom() {
    // Selectors
    var messages = jQuery('#chat');
    var newMessage = messages.children('li:last-child')
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        console.log('condition true');
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function (s) {

    console.log('connected client')




});
socket.on(receive, function (data) {
    var MsgBlock = '<li class="left"><small class="timestamp"><i class="fa fa-clock-o"></i>' + moment(data.CREATEDAT).format('lll') + '</small> <span class="avatar tooltips" data-toggle="tooltip " data-placement="left" data-original-title="Kevin Mckoy"><img src="' + data.SENDERPIC + '" alt="avatar" class="img-circle"></span><div class="body"><div style="margin-top: .5rem"  class="message well py-2 px-3  shadow  greenback rounded well-sm">' + data.MESSAGE + '</div><div class="clearfix"></div></div></li>'

    $('#chat').append(MsgBlock)
    setTimeout(() => {
        markread();
    }, 2000)

});



function send(senderpic, sendername, senderid, receiverid, receivername, receiverpic, msg) {
    var data = {
        RECEIVERID: receiverid,
        SENDERID: senderid,
        SENDERPIC: senderpic,
        SENDERNAME: sendername,
        RECEIVERNAME: receivername,
        RECEIVERPIC: receiverpic,
        MESSAGE: msg,
        CREATEDAT: Date.now()
    }
    socket.emit('message', data);
}



function sendMessage(senderpic, sendername, senderid, receiverid, receivername, receiverpic) {

    var Msg = document.getElementById('btn-input');
    console.log(Msg.value);
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:3000/chat/newmessage";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    var data = JSON.stringify({
        MESSAGE: Msg.value,
        RECEIVERID: receiverid,
        RECEIVERNAME: receivername,
        RECEIVERPIC: receiverpic


    });
    xhr.send(data);


    send(senderpic, sendername, senderid, receiverid, receivername, receiverpic, Msg.value);
    var MsgBlock = '<li class="right"><small class="timestamp font-weight-light font-italic"><i class="fa fa-clock-o"></i>' + moment(Date.now()).format('lll') + '</small><span class="avatar tooltips" data-toggle="tooltip " data-placement="left" data-original-title="Kevin Mckoy"><img src="' + senderpic + '" alt="avatar" class="img-circle"></span><div class="body">   <div style="margin-top: .5rem"  class="message py-2 px-3  shadow  greenback rounded well well-sm">' + Msg.value + '</div> <div class="clearfix"></div></div></li>'
    $('#chat').append(MsgBlock);
    Msg.value = '';
    scrollToBottom()

}

socket.on('disconnect', function () {
    console.log('Disconnected from server')
});



function markread() {
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:3000/chat/newmessage/markread";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    var data = JSON.stringify({

        RECEIVERID: receive,


    });
    xhr.send(data);

}