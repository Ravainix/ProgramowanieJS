let uluru
let map 
let marker
let markerPlace = false
let nick 
let players = []

const socket = io('77.55.215.178:3333')

socket.on('connect', () => {
  console.log('Socket connected!');
})


function initMap() {
  uluru = {
    lat: -25.363,
    lng: 131.044
  }  

  map = new google.maps.Map(document.querySelector('#map'), {
    zoom: 8,
    center: uluru,
    keyboardShortcuts: false
  })
  
  navigator.geolocation.getCurrentPosition(geoOk, geoFail)
  marker = new google.maps.Marker({position: uluru, map: map, draggable: true});
  
  window.addEventListener("keydown", e => keyPressed(e));
 
  // google.maps.event.addListener(map, 'mousemove', function(e) {
  //    marker.setPosition(e.latLng);
  //   // console.log(e.latLng);
    
  // })
}



function geoOk(data) {
  let coords = {
    lat: data.coords.latitude,
    lng: data.coords.longitude
  }
  map.setCenter(coords)
  marker.setPosition(coords)

  console.log('Marker set');
  
  markerPlace = true;
}

function geoFail (err) {
  console.log(err);
}

function keyPressed (e) {

  if(!markerPlace) return 
  let newLat
  let newLng

  if(e.target.tagName.toLowerCase() === 'input') return

  switch (e.key) {
    case "w":
      newLat = marker.getPosition().lat() + 0.01;
      newLng = marker.getPosition().lng();
      break;
  
    case "a":
      newLat = marker.getPosition().lat();
      newLng = marker.getPosition().lng() - 0.01;
      break

    case "s":
      newLat = marker.getPosition().lat() - 0.01;
      newLng = marker.getPosition().lng();
      break

    case "d":
      newLat = marker.getPosition().lat();
      newLng = marker.getPosition().lng() + 0.01;
      break

    case "ArrowUp":
      newLat = marker.getPosition().lat() + 0.01;
      newLng = marker.getPosition().lng();
      break;
  
    case "ArrowLeft":
      newLat = marker.getPosition().lat();
      newLng = marker.getPosition().lng() - 0.01;
      break

    case "ArrowDown":
      newLat = marker.getPosition().lat() - 0.01;
      newLng = marker.getPosition().lng();
      break

    case "ArrowRight":
      newLat = marker.getPosition().lat();
      newLng = marker.getPosition().lng() + 0.01;
      break

      default:
      return
  }

  var latlng = new google.maps.LatLng(newLat, newLng);
  
  marker.setPosition(latlng);

  socket.emit('position', {id: socket.id ,latlng})
}

document.querySelector('#chat-form').addEventListener('submit', (e) => {
  let msg = document.querySelector('#input').value
  e.preventDefault()
  if(msg === '') return
  socket.emit('message', { id: socket.id, content: msg})
  })

  socket.on('message', msg => {
    let child = document.createElement('li')

    child.innerHTML = `
    <div class="msg ${msg.id === socket.id ? 'self' : ''}">
      <span>${msg.content}</span>
    </div>`

    document.querySelector('.chat-content').appendChild(child)
    document.querySelector('#input').value = '';

    let wraper = document.querySelector('.overflow-wraper')
    wraper.scrollTop = wraper.scrollHeight;
  })

  if (!nick) {
    nick = prompt('Choose a username:');
    if (!nick) {
      alert('We cannot work with you like that!');
      nick = prompt('Choose a username:')
    } else {
      console.log(nick);
    }
  }