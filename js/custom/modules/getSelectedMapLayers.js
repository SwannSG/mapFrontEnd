ws.btnGetDataClicked = (event) => {

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

    turnSpinnerOn();

    //  let checkIfRsrcExists = (rsrcId) => {
    //     return new Promise( (resolve, reject) => {
    //         fetch(rsrcId, {method: 'HEAD', cache: 'no-cache'})
    //         .then(x => {
    //             resolve(x.ok);
    //         })
    //         .catch(err => {reject(err)})
    //         }
    //     )}
    
    let readUIselectorValues = () => {
        let layersToFetch = [];
        for (let el of document.getElementsByClassName('user-select__group-1')) {
            let layerDtl = {rsrcId:'', legendTitle: '',
                        fileType: '',  fileFormat: '',
                        layerType: '', layerStyle: '',
                        selectedOption: ''
                        }
            layerDtl.layerType = el.getAttribute('data-layer-type');
            layerDtl.layerStyle = el.getAttribute('data-layer-style');
            layerDtl.rsrcId = el.getElementsByTagName('select')[0].value;

            for (let option of el.getElementsByTagName('select')[0].getElementsByTagName('option')) {
                if (option.selected) {
                    layerDtl.selectedOption = option.text;
                    break;
                }
            }

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
        // remove None selections
        layersToFetch = layersToFetch.filter((item) => {if (item.rsrcId!='None') {return item}})
        
        // add point legend style details
        // mark layers if they already are on the map
        //  point layers are always re-rendered
        //  chloropleth layers are not re-rendered if they already exsist on map
        let temp = {};
        let count = 0;
        for (let each of layersToFetch) {
            
            if (each.layerType==='point') {
                if (temp.hasOwnProperty(each.selectedOption)) {
                    each.pointLayerStyle = ws.CONFIG.POINTS[each.layerStyle][temp[each.selectedOption].count];
                }
                else {
                    temp[each.selectedOption] = {}
                    temp[each.selectedOption].count = count;
                    each.pointLayerStyle = ws.CONFIG.POINTS[each.layerStyle][temp[each.selectedOption].count]; 
                    count = count + 1
                }
            }

            else if (each.layerType==='chloropleth') {
                // nothing yet
            }
        }
        return layersToFetch;
    }

    let removeLayers = (layersToFetch) => {
        // remove layers from map

        let lookup = {}
        for (let each of layersToFetch) {
            lookup[each.rsrcId] = true;
        }

        for (let rsrcId in ws.layers.mapLayer) {
            if (ws.layers.mapLayer[rsrcId].layerType==='point') {
                // always remove point layers
                ws.map.removeLayer(ws.layers.mapLayer[rsrcId].layer);
                delete ws.layers.mapLayer[rsrcId];
            }
            else if (ws.layers.mapLayer[rsrcId].layerType==='chloropleth') {
                if (lookup[rsrcId]) {
                    // don't delete chloropleth layer will be re-used
                    layersToFetch.filter(item => {
                        if (item.rsrcId===rsrcId) {
                            return item;
                        }
                    })[0].onMap = true;
                }
                else {
                    ws.map.removeLayer(ws.layers.mapLayer[rsrcId].layer);
                    delete ws.layers.mapLayer[rsrcId];
                }
            }
        }
    }

    let addLayerPromise = (layerDtl) => {
        return new Promise( (resolve, reject) => {
            if (layerDtl.fileType==='zip') {
                ws.promises.zipFileToJson(layerDtl.rsrcId)
                .then(jsonObj => {
                    ws.layers.addLayer(jsonObj, layerDtl);
                    return resolve({layerDtl: layerDtl, state:'done'});
                })
                .catch(error => {
                    // put out some message ???
                    return reject(error);
                })
            }
            else {
                ws.promises.fileToJson(layerDtl.rsrcId)
                .then(jsonObj => {
                    ws.layers.addLayer(jsonObj, layerDtl);
                    return resolve({layerDtl: layerDtl, state:'done'});
                })
                .catch(error => {
                    // put out some message ???
                    return reject(error);
                })
            }
        }
    )} 

    let makeLegend = (layersToFetch) => {

        for (let item in ws.legends.references) {
            // remove existing legend
            ws.map.removeControl(ws.legends.references[item])
        }

        let pointLegend = {};
        let chloroplethLegend = {};
        for (let each of layersToFetch) {
            if (each.layerType==='point') {
                let rowObj = {label:'', backgroundColor: '', borderColor: ''};
                rowObj.label = each.legendTitle;
                rowObj.backgroundColor = each.pointLayerStyle.fillColor;
                rowObj.borderColor = each.pointLayerStyle.color;
                if (pointLegend.hasOwnProperty(each.selectedOption)) {
                    pointLegend[each.selectedOption].push(rowObj)
                }
                else {
                    pointLegend[each.selectedOption] = [rowObj];
                }
            }
            else if (each.layerType==='chloropleth') {
                chloroplethLegend[each.legendTitle] = each.layerStyle
            }
        }

        // sort point labels in alphabetical order
        for (let item in pointLegend) {
            pointLegend[item] = pointLegend[item].sort((a,b) => {
                if (a.label < b.label) {return -1;}
                if (a.label > b.label) {return 1;}
                return 0
            })
        }

        // now add to map
        for (let item in chloroplethLegend) {
            ws.legends.references[item] = ws.legends.createLegend('bottomright',
                ws.legends.createChloroLegend(item, chloroplethLegend[item]));
        }

        for (let item in pointLegend) {
            ws.legends.references[item] = ws.legends.createLegend('bottomright', 
                ws.legends.createLegend_c(item, pointLegend[item]));
        }
    }


    // read UI
    let layersToFetch = readUIselectorValues();
    gt = layersToFetch;


    // remove some layers from existing map
    removeLayers(layersToFetch);
    
    // create legend
    makeLegend(layersToFetch);

    let addLayersPromises = [];
    gp = addLayersPromises;
    for (let layerDtl of layersToFetch) {
        if (layerDtl.onMap) {
            // layer already on map. Do nothing.
        }
        else {
            // add layer to map
            addLayersPromises.push(addLayerPromise(layerDtl))
        }
    }

    Promise.all(addLayersPromises)
    .then(() => {
        for (let item in ws.layers.mapLayer) {
            if (ws.layers.mapLayer[item].layerType==='point') {
                try {
                    ws.layers.mapLayer[item].layer.bringToFront();
                }
                catch(error) {
                    console.log(error);
                    // just carry on
                }
            }
        }
        turnSpinnerOff();
    })
    .catch((error) => console.log(error));


}

//     let autoTitle = (province, title) => {
//         if (!title) {
//             return ws.CONFIG[province].longName;
//         } else {return title;} 
//     }
    
//     event.stopPropagation();
//     // read UI input
//     let province = document.getElementsByClassName('user-select__select')[0].value;
//     let title = document.getElementsByClassName('user-select__input')[0].value;
//     // end read UI input

//     // remove map layers.
//     ws.map.eachLayer((layer) => {
//         if (layer.name === 'wards' || layer.name === 'shelters') {
//             ws.map.removeLayer(layer);
//         }
//     })
//     // end remove map layers

//     /* 
//     We can download ward data in 3 formats
//         1. geoJson              largest size        least prefered
//         2. topoJson             medium size         medium prefered
//         3. zipped topoJson      smallest size       most prefered
//     */

//     let promises = [
//         checkIfRsrcExists(ws.CONFIG[province].wardDataTopoJsonZip),
//         checkIfRsrcExists(ws.CONFIG[province].wardDataTopoJson),
//         checkIfRsrcExists(ws.CONFIG[province].wardData)
//     ]
//     Promise.all(promises)
//         .then(x => {
//             if (x[0]) {
//                 // zip
//                 ws.getJsonZipFile(ws.CONFIG[province].wardDataTopoJsonZip, 'wardDataTopoJsonZip');
//             }
//             else if (x[1]) {
//                 // topo
//                 ws.getJsonRsrc(ws.CONFIG[province].wardDataTopoJson, 'wardDataTopoJson');
//             }
//             else if (x[2]) {
//                 // geo
//                 ws.getJsonRsrc(ws.CONFIG[province].wardData, 'wardDataGeoJson');
//             }
//             else {
//                 console.log('No such data !!!!!!!!!!');
//             }
//         }) 
//         .catch(err => {
//             console.log(err)
//         });

//     ws.getJsonRsrc(ws.CONFIG[province].shelterData, 'shelterData');
//     ws.map.panTo(ws.CONFIG[province].center);

//      // create legends
//     let col2legend = createLegend_c(autoTitle(province, title),
//                 [{img: 'img/icons8-filled-circle-16.png', label: 'Shelters for woman'}]
//             )

//     let col3legend = createLegend_a('Females, 18 Years And Older, Population Density',
//         [   {color: ws.CONFIG.COLORS.BIN_1, low: '0', high: '2,000'},
//             {color: ws.CONFIG.COLORS.BIN_2, low: '2,000', high: '4,000'},
//             {color: ws.CONFIG.COLORS.BIN_3, low: '4,000', high: '6,000'},
//             {color: ws.CONFIG.COLORS.BIN_4, low: '6,000', high: '8,000'},
//             {color: ws.CONFIG.COLORS.BIN_5, low: '8,000', high: 'more'},
//         ]
//     )
//     // end create legends

//     // clear legends
//     for (each of ws.customControls) {
//         ws.map.removeControl(each);
//     }
//     ws.customControls = []
//     // end clear legends

//     // add legends to map
//     ws.customControls.push(createLegend('bottomright', [col3legend]));
//     ws.customControls.push(createLegend('bottomright', [col2legend]));
//     // end add legends to map
// }
