ws.hamburgerClicked = (event) => {
    let el = document.getElementsByClassName('user-select')[0];
    if (el.getAttribute('style')==='display: none;') {
        el.setAttribute('style', 'display: block;')
    }
    else {
        el.setAttribute('style', 'display: none;')
    } 
}