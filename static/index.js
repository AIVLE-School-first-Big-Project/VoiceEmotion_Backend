const start = document.getElementById("start");

// Record Time
var recordTime = 2000;

let mediaRecorder = null;
let audioArray = [];

start.onclick = async function (event) {
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  mediaRecorder = new MediaRecorder(mediaStream);
  new Promise((res, rej) => {
    audioArray.splice(0);
  }).then(() => {
    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
    }, recordTime);
  });

  mediaRecorder.onstart = (ev) => {
    start.style.color = "blue";
  };
  mediaRecorder.onstop = (ev) => {
    const blob = new Blob(audioArray, { type: "audio/wav" });

    const audioUrl = URL.createObjectURL(blob);

    // const blobUrl = window.URL.createObjectURL(blob);
    sendAvi(blob);
    console.log("Send?");
    start.style.color = "black";
  };
};

const sendAvi = (blob) => {
  if (blob == null) return;
  let filename = new Date().toString() + ".ogg";
  const file = new File([blob], filename);
  let fd = new FormData();
  fd.append("fname", filename);
  fd.append("file", file);
  $.ajax({
    url: "/receive",
    type: "POST",
    contentType: false,
    processData: false,
    data: fd,
    success: function (data, textStatus) {
      if (data != null) {
        setUserResponse(data);
        send(data);
      }
    },
    error: function (errorMessage) {
      setUserResponse("");
      console.log("Error" + errorMessage);
    },
  }).done(function (data) {
    console.log(data);
  });
};
