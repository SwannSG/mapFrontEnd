ws.promises = {}

ws.promises.getFile = (rsrcId) => {
    // rsrcId: url of file to get
    return new Promise((resolve, reject) => {
        fetch(rsrcId)
        .then(rspFromServer =>  {
            if (rspFromServer.ok) {
                resolve(rspFromServer);
            }
            else {
                reject({error: '', rspFromServer: rspFromServer});
            }
        })
        .catch((error) => {
            reject({error: '', rspFromServer: ''})   
            })
        })
}

ws.promises.arrayBuff =  (rspFromServer => {
    // rspFromServer.arrayBuffer: raw data of the zip file
    // resolveValue: zipped data
    return new Promise((resolve, reject) => {
        try {
            let jsZip = new JSZip();
            resolve(jsZip.loadAsync(rspFromServer.arrayBuffer()));
        }
        catch(error) {
            reject({error: error});
        }
    })
})

ws.promises.decodeZippedArrayBuff = (zipData) => {
    // zipData: jsZip data structure
    //      zipData.files = {<filename_1>:{} , <filename_2>:{}, ...}
    //          we only have one filename which we get from Object.keys(zipData.files)[0] 
    //      originalFileData (as string) = zipData.file(<filename>).async('string')
    // resolveValue: text data (original data)
    return new Promise((resolve, reject) => {
        try {
            resolve(zipData.file(Object.keys(zipData.files)[0]).async('string'));
        }
        catch(error) {
            reject({error: error});
        }
    })
}

ws.promises.parseJson = (jsonString) => {
    return new Promise( (resolve, reject) => {
        try {
            resolve(JSON.parse(jsonString));
        }
        catch(error) {
            reject({error: error});
        }
    })
}

// composite promises
ws.promises.zipFileToJson = (rsrcId) => {
    return new Promise((resolve, reject) => {
        ws.promises.getFile(rsrcId)
        .then(ws.promises.arrayBuff)
        .then(ws.promises.decodeZippedArrayBuff)
        .then(ws.promises.parseJson)
        .then(resolve)
        .catch(reject);
    })
}

