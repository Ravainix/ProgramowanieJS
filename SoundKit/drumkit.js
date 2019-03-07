document.addEventListener("DOMContentLoaded", appStart);
const recForm = document.querySelector("#recForm");
const playForm = document.querySelector("#playForm");

const channels = [
  channel1 = {
    play: false,
    data: []
  },
  channel2 = {
    play: false,
    data: []
  },
  channel3 = {
    play: false,
    data: []
  },
  channel4 = {
    play: false,
    data: []
  },
]

let isRecording = false;
let recStart = 0;
let recordingChannel;

const sounds = {
  97: "clap",
  115: "hihat",
  100: "kick",
  102: "openhat",
  103: "ride",
  104: "snere",
  106: "tink",
  107: "tom"
};

/**
 * Ustawia poczatkowe wartosci
 */
function appStart() {
  window.addEventListener("keypress", Controller);

  document.querySelector("#rec").addEventListener("click", recAudio);
}

/**
 * Obsluga nagrywania
 */
function recAudio() {
  recStart = Date.now();
  isRecording = !isRecording;
  e.target.innerHTML = isRecording ? "Stop" : "Nagrywaj";
}

/**
 * Filtruje tablice channels i odtwarza tylko te wybrane w formularzu
 */
function playAudio() {
  const filterArr = channels.filter(x => x.play)
  const soundsArr = []

  filterArr.forEach(element => {
    soundsArr.push(element.data)
  });

  [].concat.apply([], soundsArr).forEach(sound => {
    setTimeout(() => playSound(sound.name), sound.time);
  });
}

/**
 * Odtwarza dzwieki przy nacisnieciu klawisza
 * @param {event} e - event funkcji
 */
function soundController(e) {
  const soundName = sounds[e.keyCode];

  playSound(soundName);

  recordSound();
}

/**
 * Dodaje odtwarzny dzwiek do tablicy gdy nagrywnie jest wlaczone
 */
function recordSound () {
  if (isRecording) {
    switch (recordingChannel) {
      case "channel1":
        console.log("Recording channel1");
        channels[0].data.push({
          name: soundName,
          time: Date.now() - recStart
        });
        break;

      case "channel2":
        console.log("Recording channel2...");
        channels[1].data.push({
          name: soundName,
          time: Date.now() - recStart
        });
        break;

      case "channel3":
        console.log("Recording channel3...");
        channels[2].data.push({
          name: soundName,
          time: Date.now() - recStart
        });
        break;

      case "channel4":
        console.log("Recording channel...");
        channels[3].data.push({
          name: soundName,
          time: Date.now() - recStart
        });
        break;

      default:
        break;
    }
  }
}

/**
 * Odtwarza dzwiek o podanej nazwie na elemencie audio w strukturze DOM
 * @param {string} soundName - nazwa dzwieku
 */
function playSound(soundName) {
  const audioDOM = document.querySelector(`#${soundName}`);
  audioDOM.currentTime = 0;
  audioDOM.play();
}

/**
 * Obsluga wyslania formularza wyboru odtwarzania sciezki
 * Ustawia channele do odtworzenia
 */
playForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = new FormData(playForm);
  //resetuje wszystkie channele do domyslnej wartosci wyswietlenia
  for (const item of channels) {
    item.play = false
  }
  //ustawia wybrane channele do wyswietlenia
  for (const entry of data) {
    const index = entry[1]
    channels[index].play = true
  }
  playAudio();
});

/**
 * Obsluga formularza nagrywania
 * Ustawia nagrywany channel
 */
recForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = new FormData(recForm);

  for (const entry of data) {
    recordingChannel = entry[1];
  }
});

/* TODO:
- layout
- zmienic nazwe xplaySound
*/