makeGraphFocussable = function() {
    resetElementStyling();

    var vertices = vertexGroup.children;
    for (var i=0; i<vertices.length; i++) {
        makeFocusable(vertices[i]);
    }

    if (colourDetails) {
        if (colourDetails.className == '')
            colourGraph(colourString.value);
    }

    graphSVG.onmousedown = graphClicked;
    document.onmousemove = null;

    function makeFocusable(vertex) {
        vertex.onmousedown = vertexClicked;
        vertex.onmouseenter = vertexHovered;
        vertex.onmouseleave = vertexUnhovered;

        function vertexClicked(e) {
            e.preventDefault();

            if (vertex.children[0].getAttribute('r') != 30) {
                unfocusVertices();
            }
            else {
                focusVertex(vertex);
            }

            document.onmousemove = vertexDragged;
            document.onmouseup = vertexUnclicked;
        }

        function vertexDragged(e) {
            e.preventDefault();
            unfocusVertices();
            updateEditMode('move');
            makeGraphDraggable(drag=vertex, e=e);
        }

        function vertexUnclicked(e) {
            e.preventDefault();
            document.onmousemove = null;
            document.onmouseup = null;
        }

        function vertexHovered(e) {
            e.preventDefault();
            graphSVG.onmousedown = null;
        }

        function vertexUnhovered(e) {
            e.preventDefault();
            graphSVG.onmousedown = graphClicked;
        }
    }
}


function focusVertex(vertex) {
    vertexGroup.appendChild(vertex);

    unfocusCol = '#dcd3ed';
    unfocusFil = '#ece6f7';

    vname = vertex.getAttribute('name');
    vadjacent = new Set();
    edges = Array.from(edgeGroup.children);
    for (var i=0; i<edges.length; i++) {
        var e = edges[i];
        if (e.getAttribute('v1') == vname || e.getAttribute('v2') == vname) {
            e.setAttributeNS(null, 'stroke', 'black');
            e.setAttribute('style', 'stroke-width: 4px;');
            edgeGroup.appendChild(e);
            vadjacent.add(e.getAttribute('v1'));
            vadjacent.add(e.getAttribute('v2'));
        }
        else {
            e.setAttributeNS(null, 'stroke', unfocusCol);
            e.removeAttribute('style');
        }
    }

    var colourList = colourString.value.split(' ');
    var colourDict = {};
    for(var i=0; i<colourList.length; i++) {
        vcol = colourList[i].split(':');
        colourDict[vcol[0]] = colourLookUp[vcol[1]];
    }

    vertices = vertexGroup.children;
    for (var i=0; i<vertices.length; i++) {
        var v = vertices[i];
        var nextv = v.getAttribute('name');

        vcolour = '#7560cc';
        fcolour = '#f4f0fc';
        tcolour = 'white';
        if (colourDetails) {
            if (colourDetails.className == '') {
                vcolour = colourDict[nextv];
                fcolour = '#f8f5fc';
                tcolour = 'black';
            }
        }

        if (nextv == vname) {
            v.children[0].setAttribute('style', 'fill: '+vcolour+'; stroke-width: 3px;');
            v.children[0].setAttributeNS(null, 'r', 33);
            v.children[1].setAttribute('style', 'fill: '+tcolour+'; stroke: '+tcolour+'; font-size: 1.25em; stroke-width: 1px;')
        }
        else if (vadjacent.has(nextv)) {
            v.children[0].setAttribute('style', 'fill: '+fcolour+'; stroke: '+vcolour+';');
            v.children[0].setAttributeNS(null, 'r', 30);
            v.children[1].setAttribute('style', 'fill: '+vcolour+'; stroke: '+vcolour+';');
        }
        else {
            v.children[0].setAttribute('style', 'fill: '+unfocusFil+'; stroke: '+unfocusCol+';');
            v.children[0].setAttributeNS(null, 'r', 30);
            v.children[1].setAttribute('style', 'fill: '+unfocusCol+'; stroke: '+unfocusCol+';');
        }
    }
}

function unfocusVertices() {
    vertices = vertexGroup.children;
    for (var i=0; i<vertices.length; i++) {
        var v = vertices[i];
        v.children[0].removeAttribute('style');
        v.children[0].setAttributeNS(null, 'r', 30);
        v.children[1].removeAttribute('style');
    }
    edges = edgeGroup.children;
    for (var i=0; i<edges.length; i++) {
        var e = edges[i];
        e.setAttributeNS(null, 'stroke', 'black');
        e.removeAttribute('style');
    }

    if (colourDetails) {
        if (colourDetails.className == '')
        colourGraph(colourString.value);
    }
}
