/*********************************
 getUserMedia returns a Promise
 resolve - returns a MediaStream Object
 reject returns one of the following errors
 AbortError - generic unknown cause
 NotAllowedError (SecurityError) - user rejected permissions
 NotFoundError - missing media track
 NotReadableError - user permissions given but hardware/OS error
 OverconstrainedError - constraint video settings preventing
 TypeError - audio: false, video: false
 post_data - post data to flask api
 *********************************/
let post_address = '/receive'
let delay = 2000
let save_file_format = `${new Date().toString()}.wav`
let constraintObj = {audio: true}


if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
  navigator.mediaDevices.getUserMedia = function (constraintObj) {
    let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, constraintObj, resolve, reject);
    });
  }
} else {
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      devices.forEach(device => {
        console.log(device.kind.toUpperCase(), device.label);
        //, device.deviceId
      })
    })
    .catch(err => {
      console.log(err.name, err.message);
    })
}

navigator.mediaDevices.getUserMedia(constraintObj)
  .then(function (mediaStreamObj) {
    //connect the media stream to the first video element
    let video = document.querySelector('video');
    if ("srcObject" in video) {
      video.srcObject = mediaStreamObj;
    } else {
      //old version
      video.src = window.URL.createObjectURL(mediaStreamObj);
    }

    video.onloadedmetadata = function (ev) {
      //show in the video element what is being captured by the webcam
      video.play();
    };

    //add listeners for saving video/audio
    let start = document.getElementById('btnStart');
    let vidSave = document.getElementById('vid2');
    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    let chunks = [];

    start.addEventListener('click', (ev) => {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      setTimeout(() => {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
      }, 3000)
    })
    mediaRecorder.ondataavailable = function (ev) {
      chunks.push(ev.data);
    }
    mediaRecorder.onstop = (ev) => {
      let blob = new Blob(chunks, {'type': 'video/mp4;'});
      post_data(blob)
      chunks = [];
      let videoURL = window.URL.createObjectURL(blob);
      vidSave.src = videoURL;
    }
  })
  .catch(function (err) {
    console.log(err.name, err.message);
  });

function post_data(blob) {
  const fd = new FormData()
  const xhr = new XMLHttpRequest()

  xhr.open('POST', post_address, false)
  fd.append('file', blob, save_file_format)
  xhr.send(fd)
  console.log(xhr.responseText)
}