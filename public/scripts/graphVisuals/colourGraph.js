// https://sashamaps.net/docs/resources/20-colors/
var colourLookUp = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
                    '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4',
                    '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000',
                    '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9',]

colourGraph = function(colours, graphN=null) {
    if (graphN) {
        targetVertices = document.getElementById('graphVertices'+graphN);
    }
    else {
        targetVertices = vertexGroup;
    }

    var colourList = colours.split(' ');
    var colourDict = {};
    var colourSet = new Set();
    for(var i=0; i<colourList.length; i++) {
        vcol = colourList[i].split(':');
        colourDict[vcol[0]] = vcol[1];
        colourSet.add(vcol[1]);
    }

    var vertices = targetVertices.children;
    for(var i=0; i<vertices.length; i++) {
        vnum = vertices[i].getAttribute('name');
        coln = colourDict[vnum];
        while (coln >= colourLookUp.length) {
            colourLookUp.push(generateRandomColour());
        }
        vertices[i].children[0].setAttribute('style', 'fill: '+colourLookUp[coln]+';');
    }

    if (!graphN) {
        algorithmTitle.innerText = formatAlgorithm(algorithmSelect.value);

        colourNum.innerText = colourSet.size;
        aboutColours.textContent = colourSet.size;
        colourDetails.className = '';
    }
}

uncolourGraph = function(graphN=null) {
    if (graphN) {
        targetVertices = document.getElementById('graphVertices'+graphN);
    }
    else {
        targetVertices = vertexGroup;
        unfocusVertices();
    }

    vertices = targetVertices.children;
    for(var i=0; i<vertices.length; i++) {
        vertices[i].children[0].removeAttribute('style');
    }

    if (!graphN && colourDetails) {
        algorithmTitle.innerText = 'Colour graph for details';
        colourDetails.className = 'hidden';
        aboutColours.textContent = 'n/a';
    }

}

removeColouring = function() {
    algorithmTitle.innerText = 'Colour graph for details';
    colourDetails.className = 'hidden';
    aboutColours.textContent = 'n/a';
}


// https://css-tricks.com/snippets/javascript/random-hex-color/
function generateRandomColour() {
    let randomcol = '#' + Math.floor(Math.random()*16777215).toString(16);
    return randomcol;
}
