
window.onload = () => {
  
}

var map;
var markers = [];
var infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.063380, lng: -118.358080},
    zoom: 12
  });
  infoWindow = new google.maps.InfoWindow();
  
  searchStores();
}

function searchStores(){
  var foundStores = [];
  var zipCode = document.getElementById('zip').value;
  if(zipCode){
    for(var store of stores){
      var postal = store['address']['postalCode'].substring(0,5);
      if(postal == zipCode){
        foundStores.push(store);
      }
    }
  } else {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  showMarkers(foundStores);
  setOnClickListener();
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;

}
function setOnClickListener(){
  var storeElement = document.querySelectorAll('.store-container')
  storeElement.forEach(function(elem, index){
    elem.addEventListener('click', function(){
      new google.maps.event.trigger(markers[index], 'click');
    })
  })
}

function displayStores(stores){
  var storeHtml = '';
  for (var [index, store] of stores.entries()){
    var address = store['addressLines'];
    var phone = store['phoneNumber'];
    storeHtml += `
      <div class="store-container">
        <div class="store-container-background">  
          <div class="store-info-container">
            <div class="store-address" >
              <span>
                ${address[0]}
              </span>
              <span>
                ${address[1]}
              </span>
            </div>
            <div class="store-number">
              ${phone}
            </div>
          </div>  
          <div class="store-no-container">
            <div class="store-no">
                  ${index + 1}
            </div>
          </div>
        </div>
      </div>`

    document.querySelector('.store-list').innerHTML = storeHtml;
  }
}

function showMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  for (var [index, store] of stores.entries()){

    var latlng = new google.maps.LatLng(
      store["coordinates"]["latitude"],
      store["coordinates"]["longitude"]
    );

    var name = store["name"];
    var address = store["addressLines"][0];
    var openStatusText = store["openStatusText"];
    var phoneNumber = store["phoneNumber"];
    bounds.extend(latlng);

    createMarker(latlng, name, address, openStatusText, phoneNumber, index +1);
  }
  map.fitBounds(bounds);

}

function createMarker(latlng, name, address, openStatusText, phoneNumber, index){
  var html = `
    <div class= "store-info-window">
      <div class = "store-info-name">
        ${name}
      </div>
      <div class= "store-info-status">
        ${openStatusText}
      </div>
      <div class= "store-info-address">
        <div class= "circle">
          <i class="fas fa-location-arrow"></i>
        </div>
        ${address}
      </div>
      <div class="store-info-phone">
        <div class= "circle">
          <i class="fas fa-phone-alt"></i>
        </div>
        ${phoneNumber}
      </div>
    </div>
  `;
  
  
  var marker = new google.maps.Marker ({
    map: map,
    position: latlng,
    label: String(index)
  });
  google.maps.event.addListener(marker, 'click', function(){
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  
  markers.push(marker);
}