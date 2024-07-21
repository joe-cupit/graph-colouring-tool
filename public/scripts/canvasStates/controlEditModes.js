function updateEditMode(editMode) {
    switch (editMode) {
        case 'focus':
          makeGraphFocussable();
          focusButton.checked = true;
          break;
        case 'move':
          makeGraphDraggable();
          focusButton.checked = true;
          break;
        case 'add':
          makeGraphEditable();
          addButton.checked = true;
          break;
        case 'del':
          makeGraphDeletable();
          delButton.checked = true;
          break;
        default:
          makeGraphFocussable();
          focusButton.checked = true;
      }
}


function resetElementStyling() {
    document.onmousemove = null;
    document.onmousedown = null;
    document.onmouseup = null;
    graphSVG.onmousemove = null;
    graphSVG.onmousedown = null;
    vertexGroup.removeAttribute('style');
    edgeGroup.removeAttribute('style');
    graphSVG.removeAttribute('style');

    var vertices = vertexGroup.children;
    for(var i=0; i<vertices.length; i++){
        var vertex = vertices[i];
        vertex.children[0].removeAttribute('style');
        vertex.children[0].setAttributeNS(null, 'r', 30);
        vertex.children[1].removeAttribute('style');

        vertex.onmousedown = null;
        vertex.onmouseup = null;
        vertex.onmousemove = null;
        vertex.onmouseenter = null;
        vertex.onmouseleave = null;
    }

    var edges = edgeGroup.children;
    for(var i=0; i<edges.length; i++){
        var edge = edges[i];
        edge.removeAttribute('style');
        edge.setAttributeNS(null, 'stroke', 'black');

        edge.onmousedown = null;
        edge.onmouseup = null;
        edge.onmousemove = null;
        edge.onmouseenter = null;
        edge.onmouseleave = null;
    }
}


var startX, startY;

function graphClicked(e) {
    e.preventDefault();

    // get starting mouse x and y
    startX = e.clientX;
    startY = e.clientY;

    // assign functions for when mouse moves/releases
    document.onmousemove = dragGraph;
    document.onmouseup = function(e) {
        unfocusVertices();
        graphUnclicked(e);
    };

    graphSVG.setAttribute('style', 'cursor: grab;');
}

function dragGraph(e) {
    e.preventDefault();

    document.onmouseup = graphUnclicked;

    // pan the graph to its new position
    dx = e.clientX - startX;
    dy = e.clientY - startY;
    panBy(dx, dy);
    startX = e.clientX;
    startY = e.clientY;
}

function graphUnclicked(e) {
    e.preventDefault();

    // remove functions for when cursor moves/releases
    document.onmousemove = null;
    document.onmouseup = null;

    graphSVG.removeAttribute('style');
}
