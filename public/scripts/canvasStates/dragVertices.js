// inspired by https://www.w3schools.com/howto/howto_js_draggable.asp

makeGraphDraggable = function(drag=null, e=null) {
    resetElementStyling();

    var vertices = vertexGroup.children;
    for (var i=0; i<vertices.length; i++) {
        makeDraggable(vertices[i]);
    }

    if (colourDetails) {
        if (colourDetails.className == '')
            colourGraph(colourString.value);
    }

    graphSVG.onmousedown = graphClicked;

    function makeDraggable(vertex) {
        // separate the circle/text elements of the vertex
        const vertexCircle = vertex.children[0];
        const vertexText = vertex.children[1];

        vertex.onmousedown = vertexClicked;
        vertex.onmouseenter = vertexHovered;
        vertex.onmouseleave = vertexUnhovered;
        if (vertex == drag) {
            vertexClicked(e);
        }

        transform = [];

        function vertexClicked(e) {
            e.preventDefault();

            prevX = e.clientX;
            prevY = e.clientY;

            // assign functions for when mouse moves/releases
            document.onmousemove = dragVertex;
            document.touchmove = dragVertex;
            document.onmouseup = vertexUnclicked;

            // bring vertex to the top and change style
            vertexGroup.appendChild(vertex);
            vertexCircle.setAttributeNS(null, 'r', 32);
            vertexText.setAttribute('style', 'font-size: 1.2em;');
        }

        function vertexUnclicked(e) {
            updateEditMode('focus');
            focusVertex(vertex);
        }

        function dragVertex(e) {
            e.preventDefault();

            document.onmouseup = stopDragVertex;
            vertex.setAttribute('style', 'cursor: move;');

            transform = graphElements.getAttribute('transform').slice(7, -1).split(' ').map(parseFloat);

            // set the vertex its new position
            newx = vertexCircle.cx.animVal.value + (e.clientX - prevX)/transform[0];
            newy = vertexCircle.cy.animVal.value + (e.clientY - prevY)/transform[3];
            prevX = e.clientX;
            prevY = e.clientY;

            moveVertex(vertex, newx, newy);
            moved = true;

            customLayout();
        }

        function stopDragVertex() {
            // remove functions for when cursor moves/releases
            document.onmousemove = null;
            document.touchmove = null;
            document.onmouseup = null;

            // reset the vertex styling
            vertex.removeAttribute('style');
            vertexCircle.setAttributeNS(null, 'r', 30);
            vertexCircle.removeAttribute('style');
            vertexText.removeAttribute('style');

            if (colourDetails) {
                if (colourDetails.className == '')
                    colourGraph(colourString.value);                
            }
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


function moveVertex(vertex, newx, newy, targetEdges=null) {
    if (!targetEdges) {
        targetEdges = edgeGroup;
    }
    var vertexCircle = vertex.children[0];
    var vertexText = vertex.children[1];
    var vertexName = vertex.getAttribute('name');

    vertexCircle.setAttribute('cx', newx);//+'px');
    vertexCircle.setAttribute('cy', newy);//+'px');
    vertexText.setAttribute('x', newx);//+'px');
    vertexText.setAttribute('y', newy);//+'px');

    var edges = targetEdges.children;
    for(var i=0; i<edges.length; i++) {
        var line = edges[i];
        var v1 = line.getAttribute('v1');
        var v2 = line.getAttribute('v2');

        if (v1 == vertexName) {
            line.setAttributeNS(null, 'x1', newx);
            line.setAttributeNS(null, 'y1', newy);
        }
        if (v2 == vertexName) {
            line.setAttributeNS(null, 'x2', newx);
            line.setAttributeNS(null, 'y2', newy);
        }
    }
}
