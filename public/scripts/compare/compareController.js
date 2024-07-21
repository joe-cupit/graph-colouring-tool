graphTable = document.getElementById('graphTable').children[0];
graphNinput = document.getElementById('pminput');
const MAX_GRAPHS = 8;


createAllTableEntries = function() {
    table = document.getElementById('graphTable');
    tr = table.insertRow();
    n = graphNinput.value;
    for (i=1; i<=MAX_GRAPHS; i++) {
        if (i==5) tr = table.insertRow();

        td = tr.insertCell();
        td.id = 'cell'+i;
        td.appendChild(getTableSVG(i));

        if (i>n) td.style.display = 'none';
    }
}
getTableSVG = function(n) {
    tdata = document.createElement('div');
    tdata.style = 'width: 100%; height: 100%; position: relative'

    svg = document.createElementNS(svgns, 'svg');
    svg.id = 'graphSVG'+n;
    svg.classList = 'tableSVG';
    svg.addEventListener('click', function() {showOverlay()});

    gelements = document.createElementNS(svgns, 'g');
    gelements.id = 'graphElements'+n;
    gelements.setAttributeNS(null, 'transform', 'matrix(1 0 0 1 0 0)');

    gedges = document.createElementNS(svgns, 'g');
    gedges.id = 'graphEdges'+n;
    gedges.classList = 'edges';
    gelements.appendChild(gedges);

    gvertices = document.createElementNS(svgns, 'g');
    gvertices.id = 'graphVertices'+n;
    gvertices.classList = 'vertices';
    gelements.appendChild(gvertices);

    svg.appendChild(gelements);

    goverlay = document.createElementNS(svgns, 'g');
    goverlay.classList = 'tableOverlay';

    t1 = document.createElementNS(svgns, 'text');
    t1.id = 'colourInfo'+i;
    t1.style.fontWeight = 'bold';
    t1.setAttributeNS(null, 'x', 10);
    t1.setAttributeNS(null, 'y', 40);
    goverlay.appendChild(t1);

    t2 = document.createElementNS(svgns, 'text');
    t2.id = 'timeInfo'+i;
    t2.setAttributeNS(null, 'x', 10);
    t2.setAttributeNS(null, 'y', 80);
    goverlay.appendChild(t2);

    svg.appendChild(goverlay);

    tdata.appendChild(svg);

    selectDiv = document.createElement('div');
    selectDiv.id = 'colourDiv'+n;
    selectDiv.classList = 'tableColour';
    selectDiv.innerHTML = '<span id="selectText'+n+'">Select a graph colouring algorithm:<br></span><form style="display:inline-block; vertical-align: middle; margin-top: 4px;"><select id="algorithmSelect'+n+'"><option value="greedy-random">Greedy Colouring (Random)</option><option value="greedy-ordered">Greedy Colouring (by Degree)</option><option value="greedy-smallest">Greedy Colouring (Smallest Last)</option><option value="DSatur">DSatur</option><option value="RLF">Recursive Largest First</option><hr><option value="Acontraction">Addition Contraction</option><option value="Dcontraction">Deletion Contraction</option><option value="exhaustive">Exhaustive Colouring</option></select></form><i><span id="algorithmDesc'+n+'"></span></i>';
    tdata.appendChild(selectDiv);

    return tdata;
}


fillTableGraphs = function(edge_string=null, layout_string=null) {
    if (edge_string) {
        eString = edge_string;
    }
    else {
        eString = edgeString.value;
    }

    displayGraph(eString);
    circleLayout();

    if (layout_string) {
        placeVertices(layout_string);
    }

    updateGraphs();
}


startButton = function() {
    edge_string = edgeString.value;
    for (i=1; i<=graphNinput.value; i++) {
        let n = i;
        let algorithm = document.getElementById('algorithmSelect'+n).value;
        document.getElementById('graphSVG'+n).setAttribute('style', 'background:lightgrey')
        $.post('/colour', {'edge_string': edge_string, 'algorithm': algorithm, 'layout_string': null}).done(
            // use the resulting colouring:
            function(params) {
                [colours, timeTaken] = params.split('///');

                colourGraph(colours, graphN=n);

                if (['Acontraction', 'Dcontraction'].includes(algorithm)) {
                    document.getElementById('colourInfo'+n).textContent = colours + ' colours';
                }
                else {
                    colourList = colours.split(' ');
                    var colourSet = new Set();
                    for(var i=0; i<colourList.length; i++) {
                        colourSet.add(colourList[i].split(':')[1]);
                    }
                    document.getElementById('colourInfo'+n).textContent = colourSet.size + ' colours';
                }

                document.getElementById('graphSVG'+n).removeAttribute('style');

                timeTaken = parseFloat(timeTaken)*1000;
                if (timeTaken < 1) {
                timeText = '<1ms';
                }
                else if (timeTaken < 1000) {
                timeText = timeTaken.toFixed(0) + 'ms';
                }
                else {
                timeText = (timeTaken/1000).toFixed(1) + 's';
                }
                document.getElementById('timeInfo'+n).textContent = timeText;
            });
        
    }
}

updateGraphs = function() {
    vertices = graphVertices.innerHTML;
    edges = graphEdges.innerHTML;
    changeTableGraphs(vertices, edges);

    hideOverlay();
}

changeTableGraphs = function(vertices, edges) {
    for (let i=1; i<=MAX_GRAPHS; i++) {
        document.getElementById('graphVertices'+i).innerHTML = vertices;
        document.getElementById('graphEdges'+i).innerHTML = edges;
        zoomToFit(graphN=i);
        document.getElementById('colourInfo'+i).textContent = '';
        document.getElementById('timeInfo'+i).textContent = '';
    }
}


updateCount = function(change=0) {
    count = parseInt(graphNinput.value);

    count += change;
    if (count < 2) count = 2;
    else if (count > 8) count = 8;

    updateVisibleGraphs(count);
    graphNinput.value = count;
}

updateVisibleGraphs = function(count) {
    hideText = count > 4;
    for (i=1; i<=MAX_GRAPHS; i++) {
        td = document.getElementById('cell'+i);

        if (i<=count) {
            td.style.display = '';
        }
        else td.style.display = 'none';

        if (hideText) {
            document.getElementById('selectText'+i).style.display = 'none';
            // td.classList = 'tableColour tableSmaller';
        }
        else {
            document.getElementById('selectText'+i).style.display = '';
            // td.classList = 'tableColour';
        }
        
    }

    for (i=1; i<=count; i++) {
        zoomToFit(graphN=i);
    }
}

overlaySpan = document.getElementById('overlaySpan');
hideOverlay = function() {
    overlaySpan.classList = 'displaynone';
}
showOverlay = function() {
    overlaySpan.classList = '';

    zoomToFit();
}
