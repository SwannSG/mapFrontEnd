// CONFIG (add all provinces below) ************************
ws.CONFIG = {
    BIN_SIZE: 2000,
    COLORS: {
        BIN_1: '#fef0d9',
        BIN_2: '#fdcc8a',
        BIN_3: '#fc8d59',
        BIN_4: '#e34a33',
        BIN_5: '#b30000'
    },
    POINTS: {
        a: {0: {radius: 0.5, fillColor: 'turquoise', fillOpacity: .5, color: 'turquoise', weight: 1},
            1: {radius: 0.5, fillColor: 'orange', fillOpacity: 1, color: 'black', weight: 1},
            2: {radius: 0.5, fillColor: 'yellow', fillOpacity: 1, color: 'black', weight: 1}},
        b: {0: {radius: 0.3, fillColor: 'green', fillOpacity: .5, color: 'green', weight: 1},
            1: {radius: 0.3, fillColor: 'blue', fillOpacity: 1, color: 'black', weight: 1},
            2: {radius: 0.3, fillColor: 'indigo', fillOpacity: 1, color: 'black', weight: 1}},
        c: {0: {radius: 0.3, fillColor: 'black', fillOpacity: .9, color: 'black', weight: 1},
            1: {radius: 0.3, fillColor: 'gray', fillOpacity: 1, color: 'black', weight: 1},
            2: {radius: 0.3, fillColor: 'pink', fillOpacity: 1, color: 'black', weight: 1}},
    },
    MAP_INITIAL: {latlng: [-28.58, 24.52], zoom: 6},
    DELETE_LOCALSTORAGE: false
}
// end CONFIG ******************************************

// keep track of custom controls added to the map
ws.customControls = [];
// end keep track of custom controls added to the map

// keep a reference to a layer placed on the map
// ws.layer.name 
ws.layers = {};
ws.layers.mapLayer = {}
// end keep a reference to a layer placed on the map

// functionality associated with map Legends
ws.legends = {};
ws.legends.references = {}  // legend references on map
// end functionality associated with map Legends

// functionality for local storage
ws.localStorage = {};
// endfunctionality for local storage