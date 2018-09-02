ws.localStorage.addItem = (key, value) => {
    ws.idb.set(key, JSON.stringify(value))
    .then(() => console.log(key, 'added to indexDB'))
    .catch((error) => console.log('addItem', error));
}

ws.localStorage.deleteAll = () => {
    if (localStorage) {
        localStorage.clear()
    }
}

ws.localStorage.hasKey = (key) => {
    ws.idb.keys()
    .then(keys => {

    })
    .catch(error => {
        console.log('ws.idb.keys', error);
        return false;
    })

    if (localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

ws.localStorage.getItem = (key) => {
    if (localStorage) {
        return localStorage.getItem(key);
    }
    else {
        return false;
    }
}