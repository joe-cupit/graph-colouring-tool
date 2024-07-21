makeGraphEditable = function() {
    resetElementStyling();

    var newLine = null;
    var newLineV1 = null;
    var newVertex = null;

    var vertices = vertexGroup.children;
    for (var i=0; i<vertices.length; i++) {
        vertices[i].children[0].setAttribute('style', 'fill: #a9d8fc;');
        makeEditable(vertices[i]);
    }
    vertexGroup.setAttribute('style', 'cursor: crosshair;');
    graphSVG.setAttribute('style', 'background: #e8f3fc; cursor: crosshair;');
    graphSVG.onmousedown = addVertex;

    function makeEditable(vertex, isNew=false) {
        // separate the circle/text elements of the vertex
        const vertexCircle = vertex.children[0];
        const vertexText = vertex.children[1];

        vertex.onmousedown = vertexClicked;
        vertex.onmouseenter = vertexHovered;
        vertex.onmouseleave = vertexUnhovered;

        var svgTopOffset; var svgLeftOffset; var transform;

        if (isNew) {
            newVertex = true;
            vertexClicked();
        }

        function vertexClicked() {
            svgTopOffset = graphSVG.getBoundingClientRect().top
            svgLeftOffset = graphSVG.getBoundingClientRect().left
            transform = graphElements.getAttribute('transform').slice(7, -1).split(' ').map(parseFloat);

            var v = vertex.getAttribute('name');
            var x = vertexCircle.getAttribute('cx');
            var y = vertexCircle.getAttribute('cy');
            if (newLine == null) {
                vertexCircle.setAttribute('style', 'fill: #a9d8fc; stroke-width: 3px;');
                vertexCircle.setAttributeNS(null, 'r', 32);
                vertexText.setAttribute('style', 'stroke-width: 1px;');

                newLine = document.createElementNS(svgns, 'line');
                newLineV1 = vertex;
                newLine.setAttribute('style', 'stroke-width: 3px;');
                newLine.setAttributeNS(null, 'stroke', 'blue');
                newLine.setAttributeNS(null, 'v1', v);
                newLine.setAttributeNS(null, 'x1', x);
                newLine.setAttributeNS(null, 'y1', y);
                newLine.setAttributeNS(null, 'x2', x);
                newLine.setAttributeNS(null, 'y2', y);
                edgeGroup.appendChild(newLine);

                document.onmousemove = drawLine;
                graphSVG.onmousedown = null;
            }
            else {
                newLineV1.children[0].setAttribute('style', 'fill: #a9d8fc;');
                newLineV1.children[0].setAttributeNS(null, 'r', 30);
                newLineV1.children[1].removeAttribute('style');


                v1 = newLine.getAttribute('v1');
                vlist = [v, v1];
                vlist.sort(function(a, b){return a-b});

                if (v == v1) {
                    deleteLine();
                    return;
                }
                if (edgeString.value.split(' ').includes(vlist.join(','))) {
                    deleteLine();
                    return;
                }
                newLineV1 = null;
                newVertex = false;
                newLine.removeAttribute('style')
                newLine.setAttributeNS(null, 'stroke', 'black');
                newLine.setAttributeNS(null, 'v2', v);
                newLine.setAttributeNS(null, 'x2', x);
                newLine.setAttributeNS(null, 'y2', y);
                newLine = null;
                edgeString.value = (edgeString.value + ' '+vlist.join(',')).trim();

                vertexCircle.setAttribute("style", "fill: #a9d8fc;");
                vertexCircle.setAttributeNS(null, 'r', 30);
                vertexText.removeAttribute('style');

                document.onmousemove = null;
                aboutEdges.textContent = parseInt(aboutEdges.textContent) + 1;
                removeColouring();
            }
        }

        function vertexHovered(e) {
            e.preventDefault();

            vertexCircle.setAttribute('style', 'fill: #a9d8fc; stroke-width: 3px;');
            vertexCircle.setAttributeNS(null, 'r', 32);
            //vertexText.setAttribute('style', 'stroke-width: 2px;');

            graphSVG.onmousedown = null;
            document.onmousedown = null;
            vertex.onmousedown = vertexClicked;
        }

        function vertexUnhovered(e) {
            e.preventDefault();

            if (newLineV1 != vertex) {
                vertexCircle.setAttribute("style", "fill: #a9d8fc;");
                vertexCircle.setAttributeNS(null, 'r', 30);
                vertexText.removeAttribute('style');
            }

            if (newLine == null) {
                graphSVG.onmousedown = addVertex;
                document.onmousedown = null;
            }
            else {
                graphSVG.onmousedown = null;
                document.onmousedown = invalidLine;
            }

            vertex.onmouseenter = vertexHovered;
        }

        function drawLine(e) {
            e.preventDefault();

            newx = (e.clientX-svgLeftOffset)/transform[0] - transform[4]/transform[0];
            newy = (e.clientY-svgTopOffset)/transform[3] - transform[5]/transform[3];

            newLine.setAttributeNS(null, 'x2', newx);
            newLine.setAttributeNS(null, 'y2', newy);
        }

        function invalidLine(e) {
            deleteLine(e);
            graphSVG.onmousedown = addVertex;
        }

        function deleteLine(e) {
            if (newVertex) {
                if (vertexGroup.children.length == 1) {
                    addVertex(e);
                    newVertex = false;
                    newLine = null;
                    return
                }
                else {
                    vertexGroup.removeChild(newLineV1);
                    aboutVertices.textContent = parseInt(aboutVertices.textContent) - 1;
                    newVertex = false;
                }
            }
            else {
                newLineV1.children[0].setAttribute("style", "fill: #a9d8fc;");
                newLineV1.children[0].setAttributeNS(null, 'r', 30);
                newLineV1.children[1].removeAttribute('style');
                vertexCircle.setAttribute("style", "fill: #a9d8fc;");
                vertexCircle.setAttributeNS(null, 'r', 30);
                vertexText.removeAttribute('style');
            }

            if (newLine != null) {
                edgeGroup.removeChild(newLine);
            }
            newLine = null;
            newLineV1 = null;
            newVertex = false;

            document.onmousemove = null;
            document.onmousedown = null;
        }
    }

    function next_vertex_name() {
        // var vertex_list = edgeString.value.split(/,| /);
        var vertex_list = [];
        for (var vertex of vertexGroup.children) {
            vertex_list.push(vertex.getAttribute('name'));
        }
        var name = 1;
        while (vertex_list.includes(name.toString())) {
            name += 1;
        }
        return name;
    }

    function addVertex(e) {
        var name = next_vertex_name();
        var g = document.createElementNS(svgns, 'g');
        g.setAttributeNS(null, 'name', name);

        transform = graphElements.getAttribute('transform').slice(7, -1).split(' ').map(parseFloat);

        svgTopOffset = graphSVG.getBoundingClientRect().top
        svgLeftOffset = graphSVG.getBoundingClientRect().left

        // a(x)+c(y)+e
        newx = (e.clientX-svgLeftOffset)/transform[0] - transform[4]/transform[0];
        newy = (e.clientY-svgTopOffset)/transform[3] - transform[5]/transform[3];

        var circle = document.createElementNS(svgns, 'circle');
        circle.setAttributeNS(null, 'cx', newx);
        circle.setAttributeNS(null, 'cy', newy);
        circle.setAttributeNS(null, 'r', 30);

        var text = document.createElementNS(svgns, 'text');
        text.setAttributeNS(null, 'x', newx);
        text.setAttributeNS(null, 'y', newy);
        text.setAttributeNS(null, 'text-anchor', 'middle');
        text.setAttributeNS(null, 'dy', '.3em');
        text.textContent = name;

        g.appendChild(circle);
        g.appendChild(text);
        vertexGroup.appendChild(g);
        makeEditable(g, isNew=true);

        g.onmouseenter = null;

        customLayout();
        aboutVertices.textContent = parseInt(aboutVertices.textContent) + 1;
        removeColouring();
    }
}
