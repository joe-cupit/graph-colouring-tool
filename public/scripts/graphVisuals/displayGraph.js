const svgns = 'http://www.w3.org/2000/svg';

displayGraph = function(edge_string, graphN=null, layout_string=null) {
    if (graphN) {
        targetVertices = document.getElementById('graphVertices'+graphN);
        targetEdges = document.getElementById('graphEdges'+graphN);
    }
    else {
        targetVertices = vertexGroup;
        targetEdges = edgeGroup;
    }

    clearSVG(graphN=graphN);

    edgeSplit = edge_string.split(' ');
    edgeList = [];
    for(var i=0; i<edgeSplit.length; i++) {
        [v1, v2] = edgeSplit[i].split(',');
        edgeList.push([v1, v2]);
    }

    // algorithmTitle.innerText = 'Colour graph for details';
    // colourDetails.className = 'hidden';

    // fill vertex dictionary with necessary vertices
    var vertices = new Set();
    for(var i=0; i<edgeList.length; i++) {
        const [v1, v2] = edgeList[i];

        vertices.add(v1);
        vertices.add(v2);
    }

    // create vertex svg elements
    for(const vname of vertices) {
        var g = document.createElementNS(svgns, 'g');
        g.setAttributeNS(null, 'name', vname);

        var circle = document.createElementNS(svgns, 'circle');
        circle.setAttributeNS(null, 'cx', 0);
        circle.setAttributeNS(null, 'cy', 0);
        circle.setAttributeNS(null, 'r', 30);

        var text = document.createElementNS(svgns, 'text');
        text.setAttributeNS(null, 'x', 0);
        text.setAttributeNS(null, 'y', 0);
        text.setAttributeNS(null, 'text-anchor', 'middle');
        text.setAttributeNS(null, 'dy', '.3em');
        text.textContent = vname;

        g.appendChild(circle);
        g.appendChild(text);
        targetVertices.appendChild(g);
    }

    // create edge svg elements
    for(i=0; i<edgeList.length; i++) {
        var [v1, v2] = edgeList[i];
        var line = document.createElementNS(svgns, 'line');
        line.setAttributeNS(null, 'v1', v1);
        line.setAttributeNS(null, 'v2', v2);
        line.setAttributeNS(null, 'stroke', 'black');

        targetEdges.appendChild(line);
    }

    if (!graphN) {
        updateEditMode('focus');

        if (layout_string) {
            placeVertices(layout_string);
            if (document.getElementById('customLayoutButton'))
                document.getElementById('customLayoutButton').checked = true;
        }
        else {
            circleLayout();
            if (document.getElementById('circleLayoutButton'))
                document.getElementById('circleLayoutButton').checked = true;
        }
    
        $('#edgeString').val(edge_string);
    
        generateButton.disabled = false;
        if (colourButton)
            colourButton.disabled = false;
    
        if (aboutVertices) {
            aboutVertices.textContent = vertices.size;
            aboutEdges.textContent = edgeList.length;
        }
    }
}


clearSVG = function(graphN=null) {
    if (graphN) {
        targetVertices = document.getElementById('graphVertices'+graphN);
        targetEdges = document.getElementById('graphEdges'+graphN);
    }
    else {
        targetVertices = vertexGroup;
        targetEdges = edgeGroup;
    }

    uncolourGraph(graphN=graphN);
    targetVertices.innerHTML = '';
    targetEdges.innerHTML = '';

    if (!graphN) {
        edgeString.value = '';

        if (aboutVertices) {
            aboutVertices.textContent = 0;
            aboutEdges.textContent = 0;            
        }

    }

}
