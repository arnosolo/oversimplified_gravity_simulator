// Recorder setup
// const recordBtn = document.querySelector('button');
const recordBtn = document.getElementById('record-btn')
const chunks = [];
let recorder;
let isRecording = false;
let recordingTime = 0
let recordBtnTimer
let captureFrameRate = 50

function record() {
  // Start record
  chunks.length = 0;
  let options = { mimeType: 'video/webm;codecs=vp8' };
  let stream = document.querySelector('canvas').captureStream(captureFrameRate);
  recorder = new MediaRecorder(stream, options);
  recorder.ondataavailable = e => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };
  recorder.onstop = exportVideo;
  recorder.start();

  // Change recordBtn status
  recordBtn.onclick = stopRecord
  isRecording = true;
  recordBtn.textContent = '🔴 Recording 0s';
  recordBtnTimer = setInterval(() => { // Update recording text every second
    recordingTime += 1
    recordBtn.textContent = `🔴 Recording ${recordingTime}s`
  }, 1000)

}

const stopRecord = () => {
  recorder.stop();
  isRecording = false;
  recordBtn.textContent = '⏺️ Start record';
  clearInterval(recordBtnTimer) // clear timer
  recordingTime = 0
  recordBtn.onclick = record;
}

function exportVideo(e) {
  let blob = new Blob(chunks, { "type": "video/webm;codecs=vp8" });
  let vid = document.createElement('video')
  vid.src = URL.createObjectURL(blob);
  vid.controls = true;
  // vid.play();
  
  let a = document.createElement('a')
  a.href = vid.src;
  a.download = `${new Date().toLocaleString()}.webm`;
  a.click();
}

recordBtn.onclick = record;


// Puase button setup
const pauseBtn = document.getElementById('pasue-btn')
pauseBtn.onclick = pauseDrawing
function pauseDrawing () {
  if (isLooping()) {
    noLoop();
    pauseBtn.textContent = '▶️ Continue'
  } else {
    pauseBtn.textContent = '⏸️ Pause'
    loop()
  }
}

// Key event
function keyPressed() {
  if (keyCode === 80) { // 80:key P
    pauseDrawing()
  }
  if(keyCode === 82) { // 82:key R
    if(isRecording) {
      stopRecord()
    }else {
      record()
    }
  }
}