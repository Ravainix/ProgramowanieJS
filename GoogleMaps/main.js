let uluru;
let map;
let marker;
let markerPlace = false;
let nick;
let players = new Map()

const socket = io("77.55.215.178:3333");

chooseUserName();

//------------------ Maps ------------------

/**
 * Initialisation of map
 */
function initMap() {
  uluru = {
    lat: -25.363,
    lng: 131.044
  };

  map = new google.maps.Map(document.querySelector("#map"), {
    zoom: 8,
    center: uluru,
    keyboardShortcuts: false
  })

  navigator.geolocation.getCurrentPosition(geoOk, geoFail);
  players.set('local', new google.maps.Marker({
    position: uluru,
    map: map,
    draggable: true
  }))

  window.addEventListener("keydown", e => keyPressed(e));

  // google.maps.event.addListener(map, 'mousemove', function(e) {
  //    marker.setPosition(e.latLng);
  //   // console.log(e.latLng);

  // })
}

/**
 * Success localisation handler
 * @param {obj} data - Position object
 */
function geoOk(data) {
  const latlng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude); 
  map.setCenter(latlng);
  players.get('local').setPosition(latlng);

  console.log("Marker set");

  markerPlace = true;
  socket.emit("position", { id: socket.id, username: nick, latlng });
}

/**
 * Error localisation handler
 * @param {obj} err - PositionError object
 */
function geoFail(err) {
  console.log(err);
}

/**
 * Moves player marker and sends new position to socket server
 * @param {obj} e - Event object
 */
function keyPressed(e) {
  if (!markerPlace) return;
  let newLat;
  let newLng;

  if (e.target.tagName.toLowerCase() === "input") return;

  switch (e.key) {
    case "w":
      newLat = players.get('local').getPosition().lat() + 0.01;
      newLng = players.get('local').getPosition().lng();
      break;

    case "a":
      newLat = players.get('local').getPosition().lat();
      newLng = players.get('local').getPosition().lng() - 0.01;
      break;

    case "s":
      newLat = players.get('local').getPosition().lat() - 0.01;
      newLng = players.get('local').getPosition().lng();
      break;

    case "d":
      newLat = players.get('local').getPosition().lat();
      newLng = players.get('local').getPosition().lng() + 0.01;
      break;

    case "ArrowUp":
      newLat = players.get('local').getPosition().lat() + 0.01;
      newLng = players.get('local').getPosition().lng();
      break;

    case "ArrowLeft":
      newLat = players.get('local').getPosition().lat();
      newLng = players.get('local').getPosition().lng() - 0.01;
      break;

    case "ArrowDown":
      newLat = players.get('local').getPosition().lat() - 0.01;
      newLng = players.get('local').getPosition().lng();
      break;

    case "ArrowRight":
      newLat = players.get('local').getPosition().lat();
      newLng = players.get('local').getPosition().lng() + 0.01;
      break;

    default:
      return;
  }

  const latlng = new google.maps.LatLng(newLat, newLng);

  players.get('local').setPosition(latlng);

  socket.emit("position", { id: socket.id, username: nick, latlng });
}

/**
 * Sends player new message to server
 */
document.querySelector("#chat-form").addEventListener("submit", e => {
  let msg = document.querySelector("#input").value;
  e.preventDefault();
  if (msg === "") return;
  
  document.querySelector("#input").value = "";
  socket.emit("message", { id: socket.id, username: nick, content: msg });
});

//------------------ SOCKETS ------------------
/**
 * Connect event handler
 * Sends username to server
 */
socket.on('connect', () => {
  socket.emit('player-connect', nick)
  console.log("Socket connected!");
});

/**
 * Message event handler
 * Addes new message to chat when other player wrote something
 */
socket.on('message', data => {
  const strTemplate = `
    <div class="msg ${data.id === socket.id ? "my-msg" : "other-msg"}">
      <span><b>${data.username}: </b>${data.content}</span>
    </div>`;

  addMessageToChat(strTemplate);
});

socket.on('player-disconnected', data => {
  const strTemplate = `
    <div class="msg communicat">
      <span><b>${data}</b> disconnected...</span>
    </div>`;

  addMessageToChat(strTemplate);
});

/**
 * New player event handler
 * Addes notification in chat when new player connected
 */
socket.on('new-player', data => {
  console.log(data);
  
  const strTemplate = `
  <div class="msg communicat">
    <span><b>${data}</b> connected...</span>
  </div>`;
  
  addMessageToChat(strTemplate);

  const latlng = new google.maps.LatLng(players.get('local').getPosition().lat(), players.get('local').getPosition().lng());
  socket.emit("position", { id: socket.id, username: nick, latlng });
});


/**
 * Change position event handler
 * Addes/changes other players position
 */
socket.on('position', function(data) {
  if(!players.has(data.id)) {
    let asd = new google.maps.Marker({
      position: { lat: data.latlng.lat, lng: data.latlng.lng },
      map: map,
      animation: google.maps.Animation.DROP
    })

    players.set(data.id, asd)
  } else {
    players
      .get(data.id)
      .setPosition({
            lat: data.latlng.lat,
            lng: data.latlng.lng
          })
    }
})

/**
 * User disconnected event handler
 * Removes user marker on disconnect
 */
socket.on('delete-player', function(data) {
  if(!players.has(data)) {
    console.log("Player dosn't exists...");
    return
  }
  console.log(`Deleted user ${data}...`)
  players.get(data).setMap(null)
  players.delete(data)  
})

/**
 * Addes message to chat with given pattern
 * @param {string} msg - String pattern to display
 */
function addMessageToChat(msg) {
  let child = document.createElement("li");
  child.innerHTML = msg
  document.querySelector(".chat-content").appendChild(child);

  //scroll chat to lastest message
  let wraper = document.querySelector(".overflow-wraper");
  wraper.scrollTop = wraper.scrollHeight;
}

/**
 * Shows prompt on load 
 */
function chooseUserName() {
  if (!nick) {
    nick = prompt("Choose a username:");
    if (!nick) {
      alert("We cannot work with you like that!");
      chooseUserName();
    } else {
      console.log(`Choosen username: ${nick}`);
    }
  }
}

