// https://github.com/tsayen/dom-to-image

// a = domtoimage.toPng(document.getElementById('map'))

ws.domToImage = {}
ws.domToImage.saveMap = async (event) => {
    let style = {height:'100%', width:'100%'}


    let blob = await domtoimage.toPng(document.getElementById('map'), {style: style, quality: .95});
    const a = document.createElement('a');
    a.href = 'data:image/png' + blob;
    a.setAttribute('download', 'fileName.png')
    g = a;
    // el.setAttribute('href', 'image/png' + encodeURIComponent(blob));
    // el.click();
}