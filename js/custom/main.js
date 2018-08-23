

// document event handlers
document.addEventListener('DOMContentLoaded', (event) => {
    ws.DOMContentLoaded();
})


// executed when a json file has finished downloading from the server
document.body.addEventListener('gotJsonRsrcOk',  (event) => {
    ws.gotJsonRsrcOk(event);
})

document.body.addEventListener('gotZipFileOk',  (event) => {
    ws.gotZipFileOk(event);
})


// executed when user clicks on "Get Data" button ***********************************************
// document.getElementsByClassName("user-select__get-data")[0].addEventListener('click', (event) => {
//     ws.btnGetDataClicked(event);
// })

ws.toggleMapZoomControlDisplay = () => {
    if (ws.map.zoomControl._map) {
        ws.map.zoomControl.remove()
    } else {ws.map.zoomControl.addTo(ws.map)}
}


// executed when user clicks on "Map zoom toggle" button
document.getElementsByClassName('vertical-menu__magnifying-glass')[0].addEventListener('click', (event) => {
    ws.toggleMapZoomControlDisplay()
})
// END EVENT HANDLERS





// Custom Functions *****************************************


// end

ws.onMapClick = (e) => {
    console.log('Map clicked at: ',  e.latlng, 'zoom: ', ws.map.getZoom());
}



// end Custom Functions *************************************


// Map Components *******************************************
// end

