ws.DOMContentLoaded = () => {

    document.getElementsByClassName('vertical-menu__hamburger')[0].addEventListener('click', (event) => {
        ws.hamburgerClicked(event);
    })


    let createMap = () => {
        ws.map = L.map('map').setView(ws.CONFIG.MAP_INITIAL.latlng, ws.CONFIG.MAP_INITIAL.zoom);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1Ijoic3dhbm5zZyIsImEiOiJjamsweWEyczgwYjA5M3BvMjR2dDk0aTIwIn0.9I1LlFyhj77n1_Xgz__uTA'
        }).addTo(ws.map);
    }
    
    let resizeShelterMarkerOnZoom = () => {
        if (ws.layers.shelters) {
            //layerShelters object exists, apply different styling
            ws.layers.shelters.setStyle({radius: ws.map.getZoom()*0.8});
        }
    }

    createMap()
 
    // map event handlers
    ws.map.addEventListener('layeradd', (e) => {
        console.log('layeradd', e.layer.name)
    })

    ws.map.addEventListener('zoomend', resizeShelterMarkerOnZoom);

    ws.map.addEventListener('layeradd', (event) => {
        if (event.layer.name==='wards') {
            ws.layers.shelters ? ws.layers.shelters.bringToFront() : '';
        }
    })

    ws.map.addEventListener('click', ws.onMapClick);
    // end map event handlers
}

