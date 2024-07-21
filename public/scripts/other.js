function layout_graph(e) {
    $.post('/layout', {'edge_string': edgeString.value, 'type': 1}).done(
      function(result) {
        for (loc of result.split(' ')) {
          [v, pos] = loc.split(':');
          [x, y] = pos.split(',');
          for (vertex of vertexGroup.children) {
            if (vertex.getAttribute('name') == v) {
              moveVertex(vertex, x, y);
              break;
            }
          }
        }
        zoomToFit();
      });
}

function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    })
}

function parseUserInput() {
    let file = graphInput.files[0];

    readFileContent(file).then(content => {
        edge_string = '';
        for (var line of content.split('\n')) {
        if (line.startsWith('e')) {
            [e, v1, v2] = line.trim().split(' ');
            edge_string = edge_string + [v1, v2].sort(function(a, b){return a-b}).join(',') + ' ';
        }
        }
        edge_string = edge_string.trim();
        displayGraph(edge_string);
        $('#edgeString').val(edge_string);  // save the graph
    }).catch(error => console.log(error))
}
