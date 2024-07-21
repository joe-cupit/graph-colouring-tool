const graphN = document.getElementById('graphN');
const iterN = document.getElementById('iterN');
const nodesFrom = document.getElementById('nodesFrom');
const nodesTo = document.getElementById('nodesTo');
const densityFrom = document.getElementById('densityFrom');
const densityTo = document.getElementById('densityTo');

const controlsDiv = document.getElementById('controlsDiv');
const analyseButton = document.getElementById('analyseButton');
const loadingText = document.getElementById('loadingText');

let timerInt, startTime;
ANALYSIS_RESULTS = {};


function startAnalysis() {
    // disable set up elements
    controlsDiv.classList = 'controlsDiv disabled';
    $('#controlsDiv *').prop('disabled', true);
    fillSlider(fromSlider, toSlider, toSlider);
    fillSlider(fromSlider2, toSlider2, toSlider2);

    // show loading screen etc.
    document.title = "Running Analysis";
    atab0.style.display = 'block';
    window.onbeforeunload = function() {
        return true;
    };

    // start timer
    startTime = new Date().getTime();
    timerInt = setInterval(updateTimer, 1000);
    timerSpan.style = 'font-weight: normal';
    timerSpan.innerText = '00:00:00';

    // get data for analysis
    let graphs = graphN.value;
    let iterations = iterN.value;
    let algorithms = [];
    for (a of document.querySelectorAll('input.algorithmBox:checked')) {
        algorithms.push(a.name);
    }
    let graph_size = [nodesFrom.value, nodesTo.value];
    let graph_density = [densityFrom.value, densityTo.value];

    params = {'graphs': graphs, 'iterations': iterations, 'algorithms': algorithms, 'graph_size': graph_size, 'graph_density': graph_density};

    // perform analysis
    $.post('/analysis', {'params': JSON.stringify(params)})
        .done(function(results) {
            updateTimer();

            data = JSON.parse(results);
            ANALYSIS_RESULTS = data;
            ANALYSIS_RESULTS['algorithms'] = algorithms;

            // update charts tab
            colourChart = drawChart('colourChart', algorithms, data);
            timeChart = drawChart('timeChart', algorithms, data);
            displayStats(algorithms, data, graphs, iterations, graph_size, graph_density);
            createLegend(colourChart);

            // update table tab
            createResultTable(graphs, algorithms, data);
            updateIndividualChart();
            displayTableStats(algorithms, data, graphs, iterations, graph_size, graph_density);

            document.querySelectorAll('.hiddenbeforeanalysis').forEach(function(div) {
                div.style.display = 'block';
            });
        })
        .fail(function(xhr, status, error) {
            alert(status + ': ' + error);
        })
        .always(function() {
            window.onbeforeunload = null;

            // re-enable set up elements
            $('#controlsDiv *').prop('disabled', false);
            controlsDiv.classList = 'controlsDiv';
            fillSlider(fromSlider, toSlider, toSlider);
            fillSlider(fromSlider2, toSlider2, toSlider2);

            // stop the timer
            timerSpan.style = 'font-weight: bold';
            clearInterval(timerInt);
            timerInt = null;

            // hide loading overlay etc.
            atab0.style.display = 'none';
            atab0mini.style.display = 'none';
            document.title = "Analysis Results";
        });
}


function hideLoadingScreen() {
    atab0.style.display = 'none';
    atab0mini.style.display = 'block';
}
function showLoadingScreen() {
    atab0.style.display = 'block';
    atab0mini.style.display = 'none';
}


// stats section for charts tab
const statsDiv = document.getElementById('statsDiv');
function displayStats(algorithms, data, graphs, iterations, graph_size, graph_density) {
    let statshtml = '';

    statshtml += 'Randomly generated <b>';
    statshtml += graphs;
    statshtml += '</b> graphs,'

    statshtml += '<br>';
    statshtml += '<span style="margin-left: 10px;">';
    if (graph_size[0] != graph_size[1])
        statshtml += 'with between <b>' + graph_size[0] + '</b> and <b>' + graph_size[1] + '</b> vertices';
    else
        statshtml += 'each with <b>' + graph_size[0] + '</b> vertices';
    statshtml += '</span>';

    statshtml += '<br>';
    statshtml += '<span style="margin-left: 10px;">';
    statshtml += 'and ';
    if (graph_density[0] != graph_density[1])
        statshtml += '<b>' + graph_density[0] + '%</b> to <b>' + graph_density[1] + '%</b>';
    else
        statshtml += '<b>' + graph_density[0] + '%</b>';
    statshtml += ' of edges present.';
    statshtml += '</span>';

    statshtml += '<br><br>';
    var timetaken = timerSpan.innerText.split(':').map(function(item) {return parseInt(item);});
    statshtml += 'The total elapsed time was <b>';
    if (timetaken[0] > 0)
        statshtml += timetaken[0] + 'hr ';
    if (timetaken[1] > 0)
        statshtml += timetaken[1] + 'mins ';
    if (timetaken[2] > 0)
        statshtml += timetaken[2] + 's';
    else
        statshtml += '<1s';
    statshtml += '</b>'

    statshtml += '<br>';
    statshtml += '(spent <b>';
    statshtml += formatTime(data['graph_time'].reduce((a, b) => a + b, 0));
    statshtml += '</b> generating <b>';
    statshtml += graphs;
    statshtml += '</b> graphs)'

    statsDiv.innerHTML = statshtml;

    // create average chart
    drawAverageChart(algorithms, graphs, data);

    // create donut chart
    drawDonutChart(algorithms, iterations, data);
}


// stats section for table tab
const tableAboutSpan = document.getElementById('tableAboutSpan');
const dataSize = document.getElementById('dataSize');
function displayTableStats(algorithms, data, graphs, iterations, graph_size, graph_density) {
    abouthtml = '';

    var timetaken = timerSpan.innerText.split(':').map(function(item) {return parseInt(item);});
    abouthtml += '<b style="font-size:1.1em">' + graphs + '</b> graphs coloured<br>with <b style="font-size:1.1em">';
    if (algorithms.length == 1) abouthtml += '1</b> algorithm';
    else abouthtml += algorithms.length + '</b> algorithms';
    abouthtml += '<br>in <b style="font-size:1.1em">';
    if (timetaken[0] > 0)
        abouthtml += timetaken[0] + ' hr ';
    if (timetaken[1] > 0)
        abouthtml += timetaken[1] + ' mins ';
    if (timetaken[2] > 0)
        abouthtml += timetaken[2] + ' seconds';
    if (timetaken[0] == 0 && timetaken[1] == 0 && timetaken[2] == 0 )
        abouthtml += '<1s';
    abouthtml += '</b>.<br>';

    let colourSum = 0;
    let timeSum = 0;
    for (let a of algorithms) {
        colourSum += data[a+'_colour'].reduce((a, b) => a + b, 0)/graphs;
        timeSum += data[a+'_time'].reduce((a, b) => a + b, 0)/graphs
    }

    abouthtml += '<br>';
    abouthtml += 'Average colours: <b>' + (colourSum/algorithms.length).toFixed(2) + '</b><br>';
    abouthtml += 'Average run time: <b>' + formatTime(timeSum/algorithms.length) + '</b><br>';
    
    abouthtml += '<br>';

    tableAboutSpan.innerHTML = abouthtml;

    let size = new TextEncoder().encode(JSON.stringify(ANALYSIS_RESULTS)).length;
    let kiloBytes = size / 1024;

    dataSize.innerHTML = '<i>(' + kiloBytes.toFixed(1) + ' KB)</i>'
}


// stats for individual graphs on table tab
function updateGraphInfo(graphn) {
    let graphinfo = '';

    graphinfo += '<h1>Graph ' + (graphn+1) + ':</h1>';
    graphinfo += ANALYSIS_RESULTS['vertex_counts'][graphn] + ' vertices, '
    graphinfo += ANALYSIS_RESULTS['edge_counts'][graphn] + ' edges.'

    let colourSum = 0;
    let timeSum = 0;
    let lowestColN = 99999999;
    let lowestColT = 99999999;
    let lowestColA = [];
    for (let a of ANALYSIS_RESULTS['algorithms']) {
        let col = data[a+'_colour'][graphn];
        colourSum += col;
        let time = data[a+'_time'][graphn];
        timeSum += time;

        if (col < lowestColN || (col == lowestColN && time < lowestColT)) {
            lowestColN = col;
            lowestColA = [a];
            lowestColT = time;
        }
        else if (col == lowestColN && time == lowestColT) {
            lowestColA.push(a);
        }
    }
    let algCount = ANALYSIS_RESULTS['algorithms'].length;

    graphinfo += '<p style="margin-top: 10px">';
    graphinfo += 'Average colouring: <b>' + (colourSum/algCount).toFixed(2) + '</b>';
    graphinfo += '<br>';
    graphinfo += 'Average time taken: <b>' + formatTime(timeSum/algCount) + '</b>';
    graphinfo += '</p>';

    graphinfo += '<p style="margin-top: 2px">';
    graphinfo += '<span style="font-size:1.05em">Best colouring:</span><br>';
    graphinfo += '<b>' + lowestColA.map(function(a) {return formatAlgorithm(a)}).join('</b> & <b>') + '</b><br>'
    graphinfo += '<i>' + lowestColN + '</i> colours in <i>' + formatTime(lowestColT) + '</i>';
    graphinfo += '</p>';

    graphSelected.innerHTML = graphinfo;
}


// create table for table tab
const graphTable = document.getElementById('graphTable');
createResultTable = function(graphs, algorithms, data) {
    graphTable.innerHTML = '';

    let header = graphTable.createTHead();

    hrow1 = header.insertRow();
    hrow2 = header.insertRow();

    let columns = []
    hrow1.insertCell();
    hg = hrow2.insertCell();
    hg.innerHTML = '<b>Graph id</b>';

    columns.push(data['vertex_counts']);
    hrow1.insertCell();
    hv = hrow2.insertCell();
    hv.innerHTML = '<b>|V|</b>';

    columns.push(data['edge_counts']);
    hrow1.insertCell();
    he = hrow2.insertCell();
    he.innerHTML = '<b>|E|</b>';

    for (a of algorithms) {
        columns.push(data[a+'_colour']);
        columns.push(data[a+'_time'].map((t) => '<i>'+formatTime(t)+'</i>'));

        ha = hrow1.insertCell();
        ha.innerHTML = '<b>' + formatAlgorithm(a) + '</b>';
        ha.colSpan = '2';
        hc = hrow2.insertCell();
        hc.innerHTML = '<b>colours</b>';
        ht = hrow2.insertCell();
        ht.innerHTML = '<b>time</b>';
    }

    let body = graphTable.createTBody();

    for (let i=0; i<graphs; i++) {
        let row = body.insertRow();
        row.classList = 'graphRow';
        row.addEventListener('click', function() {
            if (row.classList == 'active') {
                row.classList = '';
                updateIndividualChart();
            }
            else {
                for (let r of body.children) {
                    r.classList = '';
                }
                row.classList = 'active';
                updateIndividualChart(i);
            }
        })

        g = row.insertCell();
        g.innerHTML = '<b>'+(i+1)+'</b>';

        for (c of columns) {
            r = row.insertCell();
            r.innerHTML = c[i];
        }
    }
}


// control the display of the tabs
const atab0mini = document.getElementById('analysetab0mini');
atab0mini.style.display = 'none';
const atab0 = document.getElementById('analysetab0');
atab0.style.display = 'none';
const atab1 = document.getElementById('analysetab1');
atab1.style.display = 'block';
const atab2 = document.getElementById('analysetab2');
atab2.style.display = 'none';
function switchAnalysisTabs(target) {
    if (target == 'table') {
        atab1.style.display = 'none';
        atab2.style.display = 'block';
    }
    else {
        atab1.style.display = 'block';
        atab2.style.display = 'none';
    }
}

// control the timer
const timerSpan = document.getElementById('timer');
const miniTimer = document.getElementById('minitimer');
function updateTimer() {
    var now = new Date().getTime();
    var timetaken = now - startTime;

    var hours = Math.floor((timetaken % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timetaken % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timetaken % (1000 * 60)) / 1000);

    let newtime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    timerSpan.innerText = newtime;
    miniTimer.innerText = newtime;

    let newtitle = document.title + '.';
    if (newtitle.length > 19) {
        newtitle = 'Running Analysis';
    }

    document.title = newtitle;
}


// DOWNLOAD TABLE
// https://stackoverflow.com/a/30800715
function downloadDataAsJson(){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ANALYSIS_RESULTS));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "graphdata.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
