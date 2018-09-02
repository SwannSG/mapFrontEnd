ws.localStorage.addItem = (key, value) => {
    if (localStorage) {
        if (!ws.localStorage.hasKey(key)) {
            localStorage.setItem(key,JSON.stringify(value));
        }
    }
}

ws.localStorage.deleteAll = () => {
    if (localStorage) {
        localStorage.clear()
    }
}

ws.localStorage.hasKey = (key) => {
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