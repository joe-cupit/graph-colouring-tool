makeGraphDeletable = function() {
    resetElementStyling();

    vertexGroup.setAttribute('style', 'cursor: pointer;');
    edgeGroup.setAttribute('style', 'cursor: pointer;');
    graphSVG.setAttribute('style', 'background: #ffe8e6;');

    var vertices = vertexGroup.children;
    for (var i=0; i<vertices.length; i++) {
        vertices[i].children[0].setAttribute('style', 'fill: #faaca5');
        makeVertexDeletable(vertices[i]);
    }

    function makeVertexDeletable(vertex) {
        vertex.onmousedown = vertexClicked;
        vertex.onmouseenter = vertexHovered;
        vertex.onmouseleave = vertexUnhovered;

        // separate the circle/text elements of the vertex
        const vertexCircle = vertex.children[0];
        const vertexText = vertex.children[1];

        function vertexClicked() {
            if (!allowedToDeleteVertex(vertex)) {
                alert('Graph must be connected, cannot remove this vertex');
                return;
            }
            deleteVertex(vertex);
        }

        function vertexHovered() {
            vertexCircle.setAttribute('style', 'fill: red; stroke-width: 3px;');
            vertexCircle.setAttributeNS(null, 'r', 32);
            //vertexText.setAttribute('style', 'stroke-width: 2px;');

            var edges = Array.from(edgeGroup.children);
            var vname = vertex.getAttribute('name');
            for(var i=0; i<edges.length; i++){
                var edge = edges[i];
                if (edge.getAttribute('v1') == vname || edge.getAttribute('v2') == vname) {
                    edge.setAttribute('style', 'stroke-width: 5px;');
                    edge.setAttributeNS(null, 'stroke', 'red');
                    edgeGroup.appendChild(edge);
                }
            }
        }

        function vertexUnhovered() {
            vertexCircle.setAttribute("style", "fill: #faaca5");
            vertexCircle.setAttributeNS(null, 'r', 30);
            vertexText.removeAttribute('style');

            var edges = edgeGroup.children;
            for(var i=0; i<edges.length; i++){
                edges[i].setAttribute('style', 'stroke-width: 3px;');
                edges[i].setAttributeNS(null, 'stroke', 'black');
            }
        }
    }

    var edges = edgeGroup.children;
    for(var i=0; i<edges.length; i++){
        edges[i].setAttribute('style', 'stroke-width: 3px;');
        makeEdgeDeletable(edges[i]);
    }

    function makeEdgeDeletable(edge) {
        edge.onmousedown = edgeClicked;
        edge.onmouseenter = edgeHovered;
        edge.onmouseleave = edgeUnhovered;

        function edgeClicked() {
            if (allowedToDeleteEdge(edge)) {
                deleteEdge(edge);
            }
            else {
                alert('Graph must be connected, cannot detele this edge.')
            }
        }

        function edgeHovered() {
            edge.setAttribute('style', 'stroke-width: 5px;');
            edge.setAttributeNS(null, 'stroke', 'red');
            edgeGroup.appendChild(edge);
        }

        function edgeUnhovered() {
            edge.setAttribute('style', 'stroke-width: 3px;');
            edge.setAttributeNS(null, 'stroke', 'black');
        }
    }

    function allowedToDeleteEdge(edge) {
        var vertices = [edge.getAttribute('v1'), edge.getAttribute('v2')];
        new_edge_string = edgeString.value.replace(vertices.join(','), '').replace('  ', ' ').trim();
    
        return graphIsConnected(new_edge_string);
    }

    function allowedToDeleteVertex(vertex) {
        var vname = vertex.getAttribute('name');
        var edges = edgeGroup.children;
    
        var new_edge_string = edgeString.value;
        for (var i=0; i<edges.length; i++) {
            var edge = edges[i];
            var vertices = [edge.getAttribute('v1'), edge.getAttribute('v2')];
            if (vertices.includes(vname)) {
                new_edge_string = new_edge_string.replace(vertices.join(','), '').replace('  ', ' ');
            }
        }
        return graphIsConnected(new_edge_string.trim(), ignore_vertex=vname);
    }

    function deleteEdge(edge) {
        var vertices = [edge.getAttribute('v1'), edge.getAttribute('v2')];
        vertices.sort(function(a, b){return a-b});
    
        // edgeString.value = edgeString.value.replace(' '+vertices.join(',')+' ', ' ').replace('  ', ' ').trim();
        edgeList = edgeString.value.split(' ');
        edgeList.splice(edgeList.indexOf(vertices.join(',')), 1);
        edgeString.value = edgeList.join(' ');
        edgeGroup.removeChild(edge);
        aboutEdges.textContent = parseInt(aboutEdges.textContent) - 1;
        removeColouring();
    }

    function deleteVertex(vertex) {
        const edges = edgeGroup.children;
        const vname = vertex.getAttribute('name');
        var i = 0;
        while (i<edges.length) {
            var edge = edges[i];
            if (edge.getAttribute('v1') == vname || edge.getAttribute('v2') == vname) {
                deleteEdge(edge);
            }
            else {i++}
        }
        vertexGroup.removeChild(vertex);
        aboutVertices.textContent = parseInt(aboutVertices.textContent) - 1;
        removeColouring();
    }
}


function graphIsConnected(edge_string, ignore_vertex=null) {
    adjacency_dict = getVertexNeighbours(edge_string);
    vertex_list = Object.keys(adjacency_dict);

    vertex_objects = vertexGroup.children;
    for (var i=0; i<vertex_objects.length; i++) {
        if (!vertex_list.includes(vertex_objects[i].getAttribute('name'))) {
            if (vertex_objects[i].getAttribute('name') != ignore_vertex) {
                return false;
            }
        }
    }

    v1 = vertex_list[0];
    visited_vertices = new Set([v1]);
    new_vertices = adjacency_dict[v1]

    while (new_vertices.length > 0) {
        vi = new_vertices.pop();
        if (!visited_vertices.has(vi)) {
            visited_vertices.add(vi);
            var adj = adjacency_dict[vi];
            for (var i=0; i<adj.length; i++) {
                if (!visited_vertices.has(adj[i]) && !new_vertices.includes(adj[i])) {
                    new_vertices.push(adj[i]);
                }
            }
        }
    }

    graph_vertices = vertex_list.length;
    connected_vertices = visited_vertices.size;

    return connected_vertices == graph_vertices;
}

function getVertexNeighbours(edge_string) {
    edge_split = edge_string.split(' ');
    adjacency_dict = {};
    for(var i=0; i<edge_split.length; i++) {
        [v1, v2] = edge_split[i].split(',');
        if (adjacency_dict[v1]) {
            adjacency_dict[v1].push(v2);
        }
        else {
            adjacency_dict[v1] = [v2];
        }
        if (adjacency_dict[v2]) {
            adjacency_dict[v2].push(v1);
        }
        else {
            adjacency_dict[v2] = [v1];
        }
    }
    return adjacency_dict;
}
