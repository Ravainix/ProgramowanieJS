let uluru
let map 
let marker


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
  marker = new google.maps.Marker({position: uluru, map: map});
  
  window.addEventListener("keydown", e => keyPressed(e));
}

function geoOk(data) {
  let coords = {
    lat: data.coords.latitude,
    lng: data.coords.longitude
  }
  map.setCenter(coords)
  marker.setPosition(coords)
}

function geoFail (err) {
  console.log(err);
}