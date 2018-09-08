ws.DOMContentLoaded = () => {

    document.getElementsByClassName('vertical-menu__hamburger')[0].addEventListener('click', (event) => {
        ws.hamburgerClicked(event);
    })

    document.getElementsByClassName('vertical-menu__download')[0].addEventListener('click',
        (event) => {
            ws.btnGetDataClicked(event);
        })

    document.getElementsByClassName('vertical-menu__save')[0].addEventListener('click',
    (event) => {
        ws.domToImage.saveMap(event);
    })
    


    ws.hamburgerClicked = (event) => {
        let el = document.getElementsByClassName('user-select')[0];
        if (el.getAttribute('style')==='display: none;') {
            el.setAttribute('style', 'display: block;')
        }
        else {
            el.setAttribute('style', 'display: none;')
        } 
    }

    ws.toggleMapZoomControlDisplay = () => {
        if (ws.map.zoomControl._map) {
            ws.map.zoomControl.remove()
        } else {ws.map.zoomControl.addTo(ws.map)}
    }
    
    // executed when user clicks on "Map zoom toggle" button
    // document.getElementsByClassName('vertical-menu__magnifying-glass')[0].addEventListener('click', (event) => {
    //     ws.toggleMapZoomControlDisplay()
    // })
    
    // get lat, lng in console
    ws.onMapClick = (event) => {
        console.log('Map clicked at: ',  event.latlng, 'zoom: ', ws.map.getZoom());
    }
    
    if (ws.CONFIG.DELETE_LOCALSTORAGE) {
        // clear local storage
        ws.idb.clear()
        .then(console.log('local storage cleared'))
        .catch((error) => console.log('clear local storage', error)); 
    }


    ws.getUIselectData();

    let createMap = () => {

        // NEW
        // L.CRS.CustomZoom = L.extend({}, L.CRS.EPSG3857, {
        //     scale: function (zoom) {
        //         return 256 * Math.pow(1.5, zoom);
        //     }
        // });

        // NEW

        ws.map = L.map('map',{attributionControl: false}).setView(ws.CONFIG.MAP_INITIAL.latlng, ws.CONFIG.MAP_INITIAL.zoom);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1Ijoic3dhbm5zZyIsImEiOiJjamsweWEyczgwYjA5M3BvMjR2dDk0aTIwIn0.9I1LlFyhj77n1_Xgz__uTA',
            // crs: L.CRS.CustomZoom
        }).addTo(ws.map);
    }
    
    let resizePoints = () => {
        for (let item in ws.layers.mapLayer) {
            if (ws.layers.mapLayer[item].layerType==='point') {
                ws.layers.mapLayer[item].layer.setStyle({radius: ws.map.getZoom()*ws.layers.mapLayer[item].radius});
            }
        }
    }

    createMap()
 
    ws.map.addEventListener('zoomend', resizePoints);

    ws.map.addEventListener('layeradd', (event) => {
        if (event.layer.name==='wards') {
            ws.layers.shelters ? ws.layers.shelters.bringToFront() : '';
        }
    })

    ws.map.addEventListener('click', ws.onMapClick);
    // end map event handlers
}

