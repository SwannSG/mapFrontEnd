ws.getJsonZipFile = (rsrcId, rsrcName='', eventName='gotZipFileOk') => {

    let jsZip = new JSZip();

    fetch(rsrcId)
    .then(x =>  {if (x.ok) {
        // x: Response (from server)
        return x;
    }
    else {
        let errorText = `Error downloading <span>${rsrcId}</span>. (${x.statusText} ${x.status})`; 
        ws.errorMsg(errorText);
    } 
    })
    .then(x => {
        // x.arrayBuffer: raw data of the zip file
        return jsZip.loadAsync(x.arrayBuffer())
    })
    .then(x => {
        // x: jsZip data structure
        //      x.files = {<filename_1>:{} , <filename_2>:{}, ...}
        //          we only have one filename which we get from Object.keys(x.files)[0] 
        //      originalFileData (as string) = x.file(<filename>).async('string')
        return x.file(Object.keys(x.files)[0]).async('string')
    })
    .then(x => {
        // x: string representation of original JSON, which needs to be parsed 
        return JSON.parse(x);
    })
    .then(x => {
        document.body.dispatchEvent(new CustomEvent(
            eventName,
            {detail: {
                rsrcName: rsrcName, 
                data: x
                }
            }));
    })
    .catch(err => {
        console.log(err);
        let errorText = `Error downloading <span>${rsrcId}</span>.`; 
        ws.errorMsg(errorText);
    })
}




ws.getJsonRsrc  = (rsrcId, rsrcName='', eventName='gotJsonRsrcOk') => {
    /*
    download json file, generate event when successfully downloaded
        rsrcId:     url of json file
        rsrcName:   user defined label that can be associated with downloaded data
        eventName:  default name is 'gotJsonRsrcOk'
    Must add associated event handler
        document.body.addEventListener('gotJsonRsrcOk', {event} {
            event.detail.rsrcName:  rsrcName argument value
            event.detail.data:      downloaded json file data
        }         
    */
    fetch(rsrcId)
    .then(x =>  {if (x.ok) {
                    return x.json()
                }
                else {
                    let errorText = `Error downloading <span>${rsrcId}</span>. (${x.statusText} ${x.status})`; 
                    ws.errorMsg(errorText);
                } 
    })
    .then(jsonData => {
        document.body.dispatchEvent(new CustomEvent(
            eventName,
            {detail: {
                rsrcName: rsrcName, 
                data: jsonData
                }
            }));
    })
    .catch(err => {
        console.log(err);
        let errorText = `Error downloading <span>${rsrcId}</span>.`; 
        ws.errorMsg(errorText);
    });
} 

ws.gotJsonRsrcOk = (event) => {
    if (event.detail.rsrcName === 'wardDataGeoJson') {
        ws.wardLayerGeoJson(event.detail.data);
    }
    else if (event.detail.rsrcName === 'wardDataTopoJson') {
        ws.wardLayerTopoJson(event.detail.data);
    }
    else if (event.detail.rsrcName === 'shelterData') {
        ws.sheltersLayer(event.detail.data);
    }
}

ws.gotZipFileOk = (event) => {
    // turn spinner off
    document.getElementsByClassName('user-select__get-data-spinner')[0].removeAttribute('style')
    if (event.detail.rsrcName === 'wardDataTopoJsonZip') {
        ws.wardLayerTopoJson(event.detail.data);
    }
}
