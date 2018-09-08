// https://github.com/tsayen/dom-to-image

ws.domToImage = {}
ws.domToImage.saveMap = async (event) => {

    // briefly remove zoom
    ws.toggleMapZoomControlDisplay()

    let blob;
    let styleObj = {}


    let computedStyle = window.getComputedStyle(document.getElementsByClassName('main')[0])
    styleObj.height = Math.ceil(computedStyle.height);
    styleObj.width = Math.ceil(computedStyle.width);
    styleObj.bgcolor = 'red';
   
    try {
        blob = await domtoimage.toJpeg(document.getElementsByClassName('main')[0], styleObj);
    }
    catch (error) {
        console.log(error);
    }
    const a = document.createElement('a');
    a.href = 'data:image/png' + blob;
    a.setAttribute('download', 'map.jpg')
    a.click();

    // add zoom back to map
    ws.toggleMapZoomControlDisplay()
}