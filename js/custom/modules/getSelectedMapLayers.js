ws.btnGetDataClicked = (event) => {

    /*
        check if resource exists on server.
        return promise, resolves to true|false
    */
    console.log('ws.btnGetDataClicked');

    if (window.getComputedStyle(document.getElementsByClassName('user-select')[0]).display==='none') {
        // do nothing
        return;
    }

    let turnSpinnerOn = () => {
        document.getElementsByClassName('vertical-menu__download')[0].setAttribute('style',
        "display: none;");
       document.getElementsByClassName('vertical-menu__spinner')[0].setAttribute('style',
        "display: inline-block;");
    }

    let turnSpinnerOff = () => {
        document.getElementsByClassName('vertical-menu__download')[0].setAttribute('style',
        "display: inline-block;");
       document.getElementsByClassName('vertical-menu__spinner')[0].setAttribute('style',
        "display: none;");
    }


    ws.btnGetDataClicked.on = turnSpinnerOn;
    ws.btnGetDataClicked.off = turnSpinnerOff;
 

     let checkIfRsrcExists = (rsrcId) => {
        return new Promise( (resolve, reject) => {
            fetch(rsrcId, {method: 'HEAD', cache: 'no-cache'})
            .then(x => {
                resolve(x.ok);
            })
            .catch(err => {reject(err)})
            }
        )}
    
    let readUIselectorValues = () => {
        let layersToFetch = [];
        for (let el of document.getElementsByClassName('user-select__group-1')) {
            let layerDtl = {rsrcId:'', legendTitle: '',
                        fileType: '', fileFormat: '',
                        layerType: "",
                        layerStyle: "",
                        }
            layerDtl.layerType = el.getAttribute('data-layer-type');
            layerDtl.layerStyle = el.getAttribute('data-layer-style');
            layerDtl.rsrcId = el.getElementsByTagName('select')[0].value;
            layerDtl.legendTitle = el.getElementsByTagName('input')[0].value;
            layerDtl.fileType = layerDtl.rsrcId.split('.').pop();
            if (layerDtl.fileType==='zip') {
                layerDtl.fileFormat =  layerDtl.rsrcId.split('.')[layerDtl.rsrcId.split('.').length-2]
            }
            else {
                layerDtl.fileFormat = layerDtl.fileType
            }

            layersToFetch.push(layerDtl);
        }
        return layersToFetch;
    }




    let layersToFetch = readUIselectorValues();

    let addLayerPromise = (layerDtl) => {
        return new Promise( (resolve, reject) => {
            if (layerDtl.fileType==='zip') {
                ws.promises.zipFileToJson(layerDtl.rsrcId)
                .then(jsonObj => {
                    if (layerDtl.fileFormat==='topojson') {
                        ws.addTopoJsonLayer(jsonObj, layerDtl);
                        return resolve('ok')
                        }
                    else if (layerDtl.fileFormat==='geojson') {
                        ws.addGeoJsonLayer(jsonObj, layerDtl);
                        return resolve('ok')
                    }
                })
                .catch(error => {
                    // put out some message ???
                    return reject(error);
                })
            }
        }
    
    )} 


    let addLayersPromises = [];
    for (let layerDtl of layersToFetch) {
        // is layerDtl already on map ?
        if (!ws.layers.hasOwnProperty(layerDtl.rsrcId)) {         
            // get the resource and add promise
            addLayersPromises.push(addLayerPromise(layerDtl))
        }
    }

    gt = addLayersPromises[0]



    let autoTitle = (province, title) => {
        if (!title) {
            return ws.CONFIG[province].longName;
        } else {return title;} 
    }
    
    event.stopPropagation();
    // read UI input
    let province = document.getElementsByClassName('user-select__select')[0].value;
    let title = document.getElementsByClassName('user-select__input')[0].value;
    // end read UI input

    // remove map layers.
    ws.map.eachLayer((layer) => {
        if (layer.name === 'wards' || layer.name === 'shelters') {
            ws.map.removeLayer(layer);
        }
    })
    // end remove map layers

    /* 
    We can download ward data in 3 formats
        1. geoJson              largest size        least prefered
        2. topoJson             medium size         medium prefered
        3. zipped topoJson      smallest size       most prefered
    */

    let promises = [
        checkIfRsrcExists(ws.CONFIG[province].wardDataTopoJsonZip),
        checkIfRsrcExists(ws.CONFIG[province].wardDataTopoJson),
        checkIfRsrcExists(ws.CONFIG[province].wardData)
    ]
    Promise.all(promises)
        .then(x => {
            if (x[0]) {
                // zip
                ws.getJsonZipFile(ws.CONFIG[province].wardDataTopoJsonZip, 'wardDataTopoJsonZip');
            }
            else if (x[1]) {
                // topo
                ws.getJsonRsrc(ws.CONFIG[province].wardDataTopoJson, 'wardDataTopoJson');
            }
            else if (x[2]) {
                // geo
                ws.getJsonRsrc(ws.CONFIG[province].wardData, 'wardDataGeoJson');
            }
            else {
                console.log('No such data !!!!!!!!!!');
            }
        }) 
        .catch(err => {
            console.log(err)
        });

    ws.getJsonRsrc(ws.CONFIG[province].shelterData, 'shelterData');
    ws.map.panTo(ws.CONFIG[province].center);

     // create legends
    let col2legend = createLegend_c(autoTitle(province, title),
                [{img: 'img/icons8-filled-circle-16.png', label: 'Shelters for woman'}]
            )

    let col3legend = createLegend_a('Females, 18 Years And Older, Population Density',
        [   {color: ws.CONFIG.COLORS.BIN_1, low: '0', high: '2,000'},
            {color: ws.CONFIG.COLORS.BIN_2, low: '2,000', high: '4,000'},
            {color: ws.CONFIG.COLORS.BIN_3, low: '4,000', high: '6,000'},
            {color: ws.CONFIG.COLORS.BIN_4, low: '6,000', high: '8,000'},
            {color: ws.CONFIG.COLORS.BIN_5, low: '8,000', high: 'more'},
        ]
    )
    // end create legends

    // clear legends
    for (each of ws.customControls) {
        ws.map.removeControl(each);
    }
    ws.customControls = []
    // end clear legends

    // add legends to map
    ws.customControls.push(createLegend('bottomright', [col3legend]));
    ws.customControls.push(createLegend('bottomright', [col2legend]));
    // end add legends to map
}
