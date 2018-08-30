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
        a: {0: {radius: 0.8, fillColor: 'red', fillOpacity: 1, color: 'black', weight: 1},
            1: {radius: 0.8, fillColor: 'orange', fillOpacity: 1, color: 'black', weight: 1},
            2: {radius: 0.8, fillColor: 'yellow', fillOpacity: 1, color: 'black', weight: 1}},
        b: {0: {radius: 0.7, fillColor: 'green', fillOpacity: 1, color: 'black', weight: 1},
            1: {radius: 0.7, fillColor: 'blue', fillOpacity: 1, color: 'black', weight: 1},
            2: {radius: 0.7, fillColor: 'indigo', fillOpacity: 1, color: 'black', weight: 1}},
        c: {0: {radius: 0.6, fillColor: 'white', fillOpacity: 1, color: 'black', weight: 1},
            1: {radius: 0.6, fillColor: 'gray', fillOpacity: 1, color: 'black', weight: 1},
            2: {radius: 0.6, fillColor: 'pink', fillOpacity: 1, color: 'black', weight: 1}},
    },
    MAP_INITIAL: {latlng: [-28.58, 24.52], zoom: 6},
    'ALL': {
        center: [-32.2977935398105, 26.66272775514364],
        wardData: 'data/ALLmerged.geojson',
        wardDataTopoJson: 'data/ALLmerged.topojson',
        wardDataTopoJsonZip: 'data/ALLmerged.topojson.zip',
        shelterData: 'data/ALLshelters.geojson',
        longName: 'All Provinces'
    },
    'EC': {
        center: [-32.2977935398105, 26.66272775514364],
        wardData: 'data/ECmerged.geojson',
        wardDataTopoJson: 'data/ECmerged.topojson',
        wardDataTopoJsonZip: 'data/ECmerged.topojson.zip',
        shelterData: 'data/ECshelters.geojson',
        longName: 'Eastern Cape'
    },
    'FS': {
        center: [-29.0, 26.0],
        wardData: 'data/FSmerged.geojson',
        wardDataTopoJson: 'data/FSmerged.topojson',
        wardDataTopoJsonZip: 'data/FSmerged.topojson.zip',
        shelterData: 'data/FSshelters.geojson',
        longName: 'Free State'
    },
    'GT': {
        center: [-29.0, 26.0],
        wardData: 'data/GTmerged.geojson',
        wardDataTopoJson: 'data/GTmerged.topojson',
        wardDataTopoJsonZip: 'data/GTmerged.topojson.zip',
        shelterData: 'data/GTshelters.geojson',
        longName: 'Gauteng'
    },
    'KZN': {
        center: [-30.57, 30.57],
        wardData: 'data/KZNmerged.geojson',
        wardDataTopoJson: 'data/KZNmerged.topojson',
        wardDataTopoJsonZip: 'data/KZNmerged.topojson.zip',
        shelterData: 'data/KZNshelters.geojson',
        longName: 'KwaZulu-Natal'
    },
    'LIM': {
        center: [-24.0, 29.0],
        wardData: 'data/LIMmerged.geojson',
        wardDataTopoJson: 'data/LIMmerged.topojson',
        wardDataTopoJsonZip: 'data/LIMmerged.topojson.zip',
        shelterData: 'data/LIMshelters.geojson',
        longName: 'Limpopo'
    },
    'MP': {
        center: [-30.57, 30.57],
        wardData: 'data/MPmerged.geojson',
        wardDataTopoJson: 'data/MPmerged.topojson',
        wardDataTopoJsonZip: 'data/MPmerged.topojson.zip',
        shelterData: 'data/MPshelters.geojson',
        longName: 'Mpumalanga'
    },
    'NC': {
        center: [-30.57, 30.57],
        wardData: 'data/NCmerged.geojson',
        wardDataTopoJson: 'data/NCmerged.topojson',
        wardDataTopoJsonZip: 'data/NCmerged.topojson.zip',
        shelterData: 'data/NCshelters.geojson',
        longName: 'Northern Cape'
    },
    'NW': {
        center: [-30.57, 30.57],
        wardData: 'data/NWmerged.geojson',
        wardDataTopoJson: 'data/NWmerged.topojson',
        wardDataTopoJsonZip: 'data/NWmerged.topojson.zip',
        shelterData: 'data/NWshelters.geojson',
        longName: 'North West'
    },
    'WC': {
        center: [-32.8, 20.168536735117264],
        wardData: 'data/WCmerged.geojson',
        wardDataTopoJson: 'data/WCmerged.topojson',
        wardDataTopoJsonZip: 'data/WCmerged.topojson.zip',
        shelterData: 'data/WCshelters.geojson',
        longName: 'Western Cape'
    }
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