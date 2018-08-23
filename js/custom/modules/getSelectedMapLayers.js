ws.btnGetDataClicked = (event) => {

    /*
        check if resource exists on server.
        return promise, resolves to true|false
    */
    
    // turn spinner on
    document.getElementsByClassName('user-select__get-data-spinner')[0].setAttribute('style',
     "display: inline-block;");
    
     let checkIfRsrcExists = (rsrcId) => {
        return new Promise( (resolve, reject) => {
            fetch(rsrcId, {method: 'HEAD', cache: 'no-cache'})
            .then(x => {
                resolve(x.ok);
            })
            .catch(err => {reject(err)})
            }
        )}
    


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