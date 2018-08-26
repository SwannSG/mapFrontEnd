// give a layer a name so we can easily reference it later
ws.nameLayer = (layerObj, layerName) => {
    if (layerObj.hasOwnProperty('name')) {
        console.log('cannot add "name" to layer')
    } else {layerObj.name = layerName;}
}
// end give a layer a name so we can easily reference it later

// NOT USED
// use an image instead of an SVG
// kept as a working example when using an image for a marker  
ws.OLDsheltersLayer = (layer) => {
    let homeIcon = L.icon({
        iconUrl: 'img/icons8-filled-circle-16.png',
        iconSize:     [16, 16], // size of the icon
        iconAnchor:   [8, 8], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });
   
    L.geoJSON(layer,  {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {icon: homeIcon}).bindPopup(feature.properties.name)
        }
    })
    .addTo(ws.map);
}
// end NOT USED

ws.layers.pointToLayerStyle = (styleDescr) => {
    let styleObj = ws.CONFIG.POINTS[styleDescr]
    styleObj.radius = ws.map.getZoom()*styleObj.radius
    return styleObj
}



// create and add shelters layer
ws.sheltersLayer = (layer) => {
    layerObj = L.geoJSON(layer, {
        pointToLayer: function(feature, latlng) {
                        return L.circleMarker(latlng, {
                            radius: ws.map.getZoom()*0.8,
                            fillColor: 'yellow',
                            fillOpacity: 1,
                            className: 'shelter-marker',
                            color: 'black',
                            weight: 1, 
                        }).bindPopup(feature.properties.name); 
        }
    })
    // name  the layer
    ws.nameLayer(layerObj, 'shelters');
    // add layer to map
    layerObj.addTo(ws.map);
    // keep reference to layer in ws.layers.shelters
    ws.layers.shelters = layerObj;
}
// end 

// NEW 






// create and add wardLayer from geoJson data
ws.wardLayerGeoJson = (layer) => {
    // layer argument: geoJSON data as json
    layer = L.geoJSON(layer, {style: ws.styleFeature})
    // layer: becomes a layer object
    // name the layer
    ws.nameLayer(layer, 'wards')
    // add layer to map
    layer.addTo(ws.map);
}

// ws.addTopoJsonLayer = (data, layerDtl) => {
//     // data: topoJSON
//     console.log('layerDtl', layerDtl);
//     let key = Object.keys(data.objects)[0]
//     let geojson = topojson.feature(data, data.objects[key]);
//     layer = L.geoJSON(geojson, {style: ws.styleFeature})
//     ws.nameLayer(layer, layerDtl.rsrcId)
//     ws.layers[layerDtl.rsrcId] = layer;
//     layer.addTo(ws.map);
// }

// NEW
ws.layers.addLayer = (data, layerDtl) => {
    // data: topoJson, geojson
    console.log('addTopoJsonLayer')
    let addLegendFlag = false, geojsonData, layer, legendHTML, legendKey, styleObj;
    if (layerDtl.fileFormat==='topojson') {    
        let key = Object.keys(data.objects)[0]
        geojsonData = topojson.feature(data, data.objects[key]);
    }
    else {
        geojsonData = data;
    }
    if (layerDtl.layerType==='chloropleth') {
        // chloropleth layer styles
        if (layerDtl.layerStyle==='default') {
            // map area
            styleObj = {style: ws.layers.styleFeature};
            // legend "area"
            legendKey = layerDtl.layerType + '-' + layerDtl.layerStyle 
            if (!ws.legends.currentHtml.hasOwnProperty(legendKey)) {
                ws.legends.currentHtml[legendKey] = ws.legends.createChloroLegend(layerDtl.legendTitle, layerDtl.layerStyle);
            }
        }
        // create layer
        layer = L.geoJSON(geojsonData, styleObj );
    }
    else if (layerDtl.layerType==='point') {
        let styleObj = ws.layers.pointToLayerStyle(layerDtl.layerStyle);
        layer = L.geoJSON(geojsonData, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, styleObj)
                    .bindPopup(feature.properties.name);
            }
        })
    }
    layer.addTo(ws.map);
    // track layers added to map
    ws.layers.mapLayer[layerDtl.rsrcId] = layer;
}





// used to style ward areas with fill color based on female population size
ws.layers.styleFeature = (feature) => {

    let getFillColor = (n) => {
        // n --> no of woman in ward
        let BIN_SIZE = ws.CONFIG.BIN_SIZE;
        if (n > BIN_SIZE * 4) {return ws.CONFIG.COLORS.BIN_5;}
        else if (n > BIN_SIZE * 3) {return ws.CONFIG.COLORS.BIN_4;}
        else if (n > BIN_SIZE * 2) {return ws.CONFIG.COLORS.BIN_3; }
        else if (n > BIN_SIZE * 1) {return ws.CONFIG.COLORS.BIN_2}
        else {return ws.CONFIG.COLORS.BIN_1}
    }

    return {
        fillColor: getFillColor(feature.properties.females),
        fillOpacity: .7,
        weight: 1,
        opacity: .8,
        color: 'black',
    }
}
