let createLegend = (pos, html) => {
    /*  pos: string
        html: array of html stings

    */
    let legend = L.control({position: pos});
    let el = L.DomUtil.create('div', 'legend');

    legend.onAdd = function (map) {
        el.innerHTML = htmlToAdd;
        return el;
    }        

    // assemble html
    let htmlToAdd = ``;
    for (let each of html) {
        htmlToAdd = htmlToAdd + each
    }

    legend.addTo(ws.map)
    return legend;
}

let addMapTitle = (title) => {
    let legend = L.control({position: 'topleft'});
    let el = L.DomUtil.create('div', 'map-title');

    legend.onAdd = function (map) {
        el.innerHTML = `<h2 class="u-center-text">${title}</h2>`;
        return el;
    }        
    legend.addTo(ws.map);
    return legend;
}


// legend(_b) of the form 
//  title
//  img     label
//  img     label
let createLegend_b = (title, rows) => {
    /*  rows: array of row objects
        row:{img: imgUrl, label: string}
        returns html string

    */

   let heading = `  <div class="legend-b__heading">
                        <h4 class="u-center-text">${title}</h4>
                    </div>`
    let rowsHtml = [];
    for (let each of rows) {
        let each_row =  `<div class="legend-b__row">
                            <figure class="legend-b__figure">
                                <img src="${each.img}">
                            </figure>
                            <div class="legend-b__label">${each.label}</div>
                        </div>`;
        rowsHtml.push(each_row);     
    }
    // assemble rowsHtml
    let rowsAll = ``;
    for (let each of rowsHtml) {
        rowsAll = rowsAll + each
    }

    // add legend_b div wrapper
    return `<div class="legend-b">` + heading + rowsAll + `</div>`
}
// end

// legend(_c) of the form 
//  title
//  circle     label
//  circle     label
let createLegend_c = (title, rows) => {
    /*  rows: array of row objects
        row:{label: string}
        returns html string
    */

   let heading = `  <div class="legend-c__heading">
                        <h4 class="u-center-text">${title}</h4>
                    </div>`
    let rowsHtml = [];
    for (let each of rows) {
        let each_row =  `<div class="legend-c__row">
                            <div class=legend-c__swatch>
                                <div class=legend-c__swatch-circle></div>
                            </div>
                            <div class="legend-c__label">${each.label}</div>
                        </div>`;
        rowsHtml.push(each_row);     
    }
    // assemble rowsHtml
    let rowsAll = ``;
    for (let each of rowsHtml) {
        rowsAll = rowsAll + each
    }

    // add legend_c div wrapper
    return `<div class="legend-c">` + heading + rowsAll + `</div>`
}
// end


// legend(_c) of the form 
//  title
//  swatch  low <sep> high
let createLegend_a = (title, rows, sep=' - ') => {
    /*  title: text string
        rows: array of row objects {color: '#b30000', low: '0', high: '1,000'}
        sep:  seperator, text string
        return html string
    */

    let rowsHtml = [];
    let heading = ` <div class="legend-a__heading">
                        <h4 class="u-center-text">${title}</h4>
                    </div>`

    for (let each of rows) {
        let each_row =  `<div class="legend-a__row">
                            <div class="legend-a__item-swatch" style="background-color: ${each.color};"></div>
                            <div class="legend-a__item-low">${each.low}</div>
                            <div class="legend-a__item-sep">${sep}</div>    
                            <div class="legend-a__item-high">${each.high}</div>    
                        </div>`
        rowsHtml.push(each_row);
    }
    // assemble rowsHtml
    let rowsAll = ``;
    for (let each of rowsHtml) {
        rowsAll = rowsAll + each
    }

    // return heading + rowsAll;
    return heading + rowsAll;
}
