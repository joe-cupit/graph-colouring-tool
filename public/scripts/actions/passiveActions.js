$(document).ready(function() {
    // when the vertex input changes
    $('#vertexInput').on('change', function(e) {
        e.preventDefault();

        if (vertexInput.valu < 2) {
            vertexInput.value = 2;
        }
        refreshEdgeTotal()
    });

    $('input[type=radio][name=edit-mode]').on('change', function() {
        updateEditMode($(this).val());
    });
});


function refreshEdgeTotal() {
    var vertex_count = vertexInput.value;
    if (vertex_count == '' || vertex_count < 2) {
        return;
    }
    var min_edges = vertex_count-1;
    var max_edges = vertex_count*(vertex_count-1)/2;
    var edge_total = max_edges-min_edges;

    // current range slider is slid
    var range_perc = 100*(edgeInput.value-edgeInput.min)/(edgeInput.max-edgeInput.min);

    edgeInput.max = edge_total;
    edgeInput.value = Math.round(range_perc*(edgeInput.max-edgeInput.min)/100);

    if (vertexInput.value) {
        edgeTotal.value = parseInt(vertexInput.value)-1 + parseInt(edgeInput.value);
    }
}


function updateHistory() {
    $.get('/history').done(function(history) {
        if (history == '' && historyList) {
            historyList.innerHTML = '';
            return;
        }

      var historyHTML = '';
      let currentGraph = '';
      let hList = history.split(';');
      for (var i=0; i<hList.length; i++) {
        let colouring = JSON.parse(hList[i]);

        if (colouring.edgestring != currentGraph) {
            let newString = colouring.edgestring;
            edgeSplit = newString.split(' ');
            edgeList = [];
            vertexSet = new Set();
            for(var e=0; e<edgeSplit.length; e++) {
                [v1, v2] = edgeSplit[e].split(',');
                edgeList.push([v1, v2]);
                vertexSet.add(v1);
                vertexSet.add(v2);
            }

            historyHTML += '<span class="historytitle" onclick="displayGraph(\''+newString+'\',null,\''+colouring.layoutstring+'\')">'+vertexSet.size+' vertices, '+edgeList.length+' edges</span>';
            currentGraph = newString;
        }

        historyHTML += '<li>';
        historyHTML += '<b onclick="loadHistory(\'';
        historyHTML += colouring.edgestring + '\',\'' + colouring.layoutstring + '\',\'' + colouring.colouring + '\',\''
        historyHTML += formatAlgorithm(colouring.algorithm) + '\',\'' + formatTime(colouring.timetaken)+'\'';
        historyHTML += ')">' + formatAlgorithm(colouring.algorithm) + '</b><br><span class="historyinfo">';
        historyHTML += colouring.colours + ' colours in ' + formatTime(colouring.timetaken);
        historyHTML += '</span></li>';
      }

      historyList.innerHTML = historyHTML;

    });
    
}
function clearHistory() {
    $.ajax({
      url: 'history',
      type: 'DELETE'
    });
    historyList.innerHTML = '';
}
function loadHistory(edge_string, layout_string, colouring, algorithm, timetext) {
    displayGraph(edge_string, null, layout_string);
    colourGraph(colouring);
    algorithmTitle.innerText = algorithm;
    colourTime.innerText = timetext;
}


function newAlgorithm() {
    algorithmDesc.innerHTML = getAlgorithmDesc(algorithmSelect.value);
}


graphInput.addEventListener('change', function(){
    fileChosen.innerText = this.files[0].name;
    graphSelect.value = '';
    displayButton.disabled = false;
})

graphSelect.addEventListener('change', function(){
    if (this.value == '') {
        fileChosen.innerHTML = '<i>No file selected.</i>';
        displayButton.disabled = true;
    } else {
        fileChosen.innerHTML = this.selectedOptions[0].text;
        displayButton.disabled = false;
    }
    graphInput.value = '';
})


function initialiseIndexGraph() {

    $.get('/graphstring').done(function(edge_string) {
        if (edge_string) {
            $.get('/layoutstring').done(function(layout_string) {
                displayGraph(edge_string, null, layout_string);
            })
        }
        else {
            displayGraph('1,2 1,6 2,3 1,4 3,5 5,6 3,7 5,7');
            placeVertices('1:172.61994623071095,14.819363862135544 2:134.20381261270202,-148.97779798064914 3:-27.151068768971584,-180.92512578971565 4:312.7892710131374,87.84582944287264 5:-102.2745924309628,-36.73088592645153 6:16.369303646040073,77.19757573322332 7:-178.3354328838163,-168.02404507445928');        
        }
    })

}


function initialiseCompareGraphs() {

    $.get('/graphstring').done(function(edge_string) {
        $.get('/layoutstring').done(function(layout_string) {
            fillTableGraphs(edge_string, layout_string);
        })
    })

}


const beforeUnloadListener = (event) => {
    edge_string = edgeString.value;
    $.post('/graphstring', {'edge_string': edge_string});

    layout_string = getVertexLocations();
    $.post('/layoutstring', {'layout_string': layout_string});
};

window.addEventListener("beforeunload", beforeUnloadListener);
