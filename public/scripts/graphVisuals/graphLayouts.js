function placeVertices(pos) {
    for (loc of pos.split(' ')) {
        [v, pos] = loc.split(':');
        [x, y] = pos.split(',');
        for (vertex of vertexGroup.children) {
          if (vertex.getAttribute('name') == v) {
            moveVertex(vertex, parseFloat(x), parseFloat(y));
            break;
          }
        }
    }
    zoomToFit();
}

function getVertexLocations() {
    let loc_string = '';

    for (vertex of vertexGroup.children) {
        loc_string += vertex.getAttribute('name') + ':';
        loc_string += vertex.children[0].getAttribute('cx') + ',' + vertex.children[0].getAttribute('cy');
        loc_string += ' ';
    }

    return loc_string.trim();
}


function randomLayout() {
    const vcount = Array.from(vertexGroup.children).length;

    area = vcount*(100**2)
    sidelen = Math.sqrt(area)

    const vertices = vertexGroup.children;
    var locs = [];
    newx = Math.random()*sidelen;
    newy = Math.random()*sidelen;
    for(var i=0; i<vertices.length; i++) {
        tried = 0;
        while (locTooClose([newx, newy], locs)) {
            newx = Math.random()*sidelen;
            newy = Math.random()*sidelen;
            if (tried >= 5) break;
            tried += 1;
        }
        moveVertex(vertices[i], newx, newy);
        locs.push([newx, newy]);
    }

    zoomToFit();
}
function locTooClose(loc, taken) {
    for (var t of taken) {
        if (Math.sqrt((loc[0]-t[0])**2 + (loc[1]-t[1])**2) < 70) return true;
    }
    return false;
}


function circleLayout(graphN=null) {
    if (graphN) {
        targetVertices = document.getElementById('graphVertices'+graphN);
        targetEdges = document.getElementById('graphEdges'+graphN);
    }
    else {
        targetVertices = vertexGroup;
        targetEdges = edgeGroup;
    }

    const vertices = Array.from(targetVertices.children).sort((a,b) => a.getAttribute('name') - b.getAttribute('name'));
    const vcount = vertices.length;
    const theta = 2*Math.PI / vertices.length;
    var radius = vcount*12;

    if (vcount < 20) {
        radius = radius * (20/vcount);
    }

    for(var i=0; i<vertices.length; i++) {
        newx = Math.cos(i*theta - Math.PI/2)*radius;
        newy = Math.sin(i*theta - Math.PI/2)*radius;
        moveVertex(vertices[i], newx, newy, targetEdges=targetEdges);
    }
    
    zoomToFit(graphN=graphN);
}


function customLayout() {
    if (document.getElementById('customLayoutButton'))
        document.getElementById('customLayoutButton').checked = true;
}
