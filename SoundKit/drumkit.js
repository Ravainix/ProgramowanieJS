document.addEventListener('DOMContentLoaded', appStart)

const channel1 = []
const channel2 = []
const channel3 = []
const channel4 = []

let isRecording = false
let recStart = 0

const sounds = {
  97 : "clap",
  115: "hihat",
  100: "kick",
  102: "openhat",
  103: "ride",
  104: "snere",
  106: "tink",
  107: "tom"
}

function appStart() {
  window.addEventListener('keypress', xplaySound)

  document.querySelector('#rec').addEventListener('click', recAudio)
  document.querySelector('#play').addEventListener('click', playAudio)
}

function recAudio (e) {
  recStart = Date.now()
  isRecording = !isRecording
  e.target.innerHTML = isRecording ? 'Stop' : 'Nagrywaj'
}

function playAudio () {
  channel1.forEach(sound => {
    setTimeout(
      () => playSound(sound.name), sound.time
    )
  })
}

/**
 * Odtwarza dzwiek po nacisnieciu klawisza
 * @param {*} e 
 */
function xplaySound (e) { //nazwa do zmiany
  const soundName = sounds[e.keyCode]
  
  playSound(soundName);

if(isRecording) {
    channel1.push(
      {
        name: soundName,
        time: Date.now() - recStart
      }
    )
  }
}


function playSound(soundName) {
  const audioDOM = document.querySelector(`#${soundName}`);
  audioDOM.currentTime = 0;
  audioDOM.play();
}


/* TODO:
- dodac komentarze
- zrobic ladny kod 
- layout
- 4 kanaly
- zmienic nazwe xplaySound
*/