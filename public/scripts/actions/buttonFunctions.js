function generateButtonClicked(e) {
    if (e) e.preventDefault();

    generateButton.disabled = true;

    var vertexCount = $('#vertexInput').val();
    var edgeCount = $('#edgeTotal').val();

    $.post('/generator', {'vertices': vertexCount, 'edges': edgeCount})
      .done(function(edgeString) {
        // use the generated graph:
        if (edgeString) {
          displayGraph(edgeString);          // display the graph
          $('#edgeString').val(edgeString);  // save the graph
        }
        else {
          alert('Invalid vertex and edge combination')
        }
      })
      .fail(function(xhr, status, error) {
        alert(status + ': ' + error);
      });
}


function colourButtonClicked() {
    var edge_string = $('#edgeString').val();
    if (!edge_string) {
      return
    }

    colourButton.disabled = true;

    colourDetails.className = 'hidden';

    setTimeout(() => {
      if (colourDetails.className == 'hidden') {
        algorithmTitle.innerHTML = '<span class="lds-dual-ring"></span> colouring graph...';
      }}, 100);

    let algorithm = algorithmSelect.value;

    $.post('/colour', {'edge_string': edge_string, 'algorithm': algorithm, 'layout_string': getVertexLocations()})
      .done(function(params) {
        // use the resulting colouring:
        var endTime = performance.now();
        [colours, timeTaken] = params.split('///');

        updateEditMode('focus');

        colourGraph(colours);             // colour the graph
        $('#colourString').val(colours);  // save the colouring

        if (['Acontraction', 'Dcontraction'].includes(algorithm)) {
          colourNum.innerText = colours;
        }

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
        colourTime.innerText = timeText;
    })
    .fail(function(xhr, status, error) {
      alert(status + ': ' + error);
    })
    .always(function() {
      colourButton.disabled = false;
      updateHistory();
    });

  }


const exampleGraphs = {'ex1': exampleGraph1, 'ex2': exampleGraph2, 'ex3': exampleGraph3, 'ex4': exampleGraph4};

function displayButtonClicked() {
  filename = graphSelect.value;

  if (filename == '') {
    parseUserInput();
    return;
  }
  else {
    newEdgeString = exampleGraphs[filename];
    displayGraph(newEdgeString);
    $('#edgeString').val(newEdgeString);
  }
}


function downloadButtonClicked() {
  edge_string = edgeString.value;
  if (!edge_string) return;

  let edge_list = []
  for (edge of edge_string.split(' ')) {
    edge_list.push(edge.split(','));
  }
  edge_list.sort(function(a,b) {
    if (a[0] === b[0]) {
      return a[1] - b[1];
    }
    return a[0] - b[0];
  });

  var d = new Date();
  output = 'c DESCRIPTION: Custom graph saved ' + d.toLocaleString() + '\nc\n';

  output_edges = ''
  vertex_set = new Set()
  for (var [v1, v2] of edge_list) {
    vertex_set.add(v1);
    vertex_set.add(v2);

    output_edges += '\ne ' + v1 + ' ' + v2;
  }

  output += 'p edge ' + vertex_set.size + ' ' + edge_list.length;
  output += output_edges;

  var dataStr = "data:text;charset=utf-8," + encodeURIComponent(output);
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", "customgraph.col");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
