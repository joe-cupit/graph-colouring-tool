// inspired by https://www.petercollingridge.co.uk/tutorials/svg/interactive/pan-and-zoom/

var transformMatrix = [1, 0, 0, 1, 0, 0];

if (graphSVG) {
    var positionInfo = graphSVG.getBoundingClientRect();
    var centerX = positionInfo.width /2;
    var centerY = positionInfo.height /2;
}



function panBy(dx, dy, targetElements=graphElements) {
    transformMatrix[4] += dx;
    transformMatrix[5] += dy;

    var newMatrix = "matrix(" +  transformMatrix.join(' ') + ")";
    targetElements.setAttributeNS(null, "transform", newMatrix);
}

function panTo(x, y, targetElements=graphElements) {
    transformMatrix[4] = -x;
    transformMatrix[5] = -y;

    var newMatrix = "matrix(" +  transformMatrix.join(' ') + ")";
    targetElements.setAttributeNS(null, "transform", newMatrix);
}


function zoomBy(scale, targetElements=graphElements) {
    var positionInfo = graphSVG.getBoundingClientRect();
    var centerX = transformMatrix[4] - (positionInfo.width)/2;
    var centerY = transformMatrix[5] - (positionInfo.height)/2;

    transformMatrix[0] *= scale;
    transformMatrix[3] *= scale;

    transformMatrix[4] -= (1-scale) * centerX;
    transformMatrix[5] -= (1-scale) * centerY;

    var newMatrix = "matrix(" +  transformMatrix.join(' ') + ")";
    targetElements.setAttributeNS(null, "transform", newMatrix);
}

function zoomTo(level, targetElements=graphElements) {
    transformMatrix[0] = level;
    transformMatrix[3] = level;

    var newMatrix = "matrix(" +  transformMatrix.join(' ') + ")";
    targetElements.setAttributeNS(null, "transform", newMatrix);
}

function zoomToFit(graphN=null) {
    if (graphN) {
        targetVertices = document.getElementById('graphVertices'+graphN);
        targetSVG = document.getElementById('graphSVG'+graphN);
        targetElements = document.getElementById('graphElements'+graphN);
    }
    else {
        targetVertices = vertexGroup;
        targetSVG = graphSVG;
        targetElements = graphElements;
    }

    let Xs = [];
    let Ys = [];
    for (var vertex of targetVertices.children) {
        Xs.push(parseFloat(vertex.children[0].getAttribute('cx')));
        Ys.push(parseFloat(vertex.children[0].getAttribute('cy')));
    }

    if (Xs.length == 0) {
        return;
    }

    minX = Math.min(...Xs);
    maxX = Math.max(...Xs);
    minY = Math.min(...Ys);
    maxY = Math.max(...Ys);

    var positionInfo = targetSVG.getBoundingClientRect();
    var graphX = positionInfo.width;
    var graphY = positionInfo.height;

    widthX = (maxX - minX) + 100
    var zoomX = graphX / widthX;
    widthY = (maxY - minY) + 100
    var zoomY = graphY / widthY;
    newZoom = Math.min(zoomX, zoomY)
    zoomTo(newZoom, targetElements=targetElements);

    midX = ((maxX + minX) / 2)*newZoom;
    midY = ((maxY + minY) / 2)*newZoom;
    panTo(midX-graphX/2, midY-graphY/2, targetElements=targetElements);
}
