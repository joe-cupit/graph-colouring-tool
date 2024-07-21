let colourChart = null;
let timeChart = null;
let averageChart =null;
let donutChart = null;

Chart.defaults.global.defaultBorderColor = '#0a0a0a';
Chart.defaults.global.defaultFontColor = '#0a0a0a';
Chart.defaults.global.defaultFontSize = 14;
Chart.defaults.global.defaultFontFamily = 'Segoe UI';
Chart.defaults.global.title.fontSize = 18;

const algorithmColours = {
    'greedy-random': '#e60049',
    'greedy-ordered': '#0bb4ff',
    'greedy-smallest': '#5CDB42',
    'DSatur': '#F18F01',
    'RLF': '#9b19f5',
    'exhaustive': '#36454F',
    'Acontraction': '#dc0ab4',
    'Dcontraction': '#06d1b0'
}


// DRAWING GRAPHS
function drawChart(graphname, algorithms, data) {
    // reset chart canvas
    let newCanvas = document.createElement('canvas');
    newCanvas.id = graphname;

    let container = document.getElementById(graphname+'Div');
    container.innerHTML = '';
    container.appendChild(newCanvas);

    // set up chart data
    let graphtype = graphname.replace('Chart', '');

    let labels = data['graph_numbers'];
    let vertex_counts = data['vertex_counts'];
    let edge_counts = data['edge_counts'];

    let hoverlabels = generateHoverLabels(data);

    let datasets = [];
    for (a of algorithms) {
        let adata = {
            data: data[a+'_'+graphtype],
            label: formatAlgorithm(a),
            labels: hoverlabels,
            borderColor: algorithmColours[a],
            backgroundColor: algorithmColours[a],
            pointStyle: 'circle',
            pointRadius: 2,
            pointHoverRadius: 5,
            borderWidth: 2,
            fill: false
        };
        datasets.push(adata);
    }

    let title = '';
    let yAxisTitle = '';
    let xAxisTitle = 'Graph id';
    axisTicks = {beginAtZero: true};
    if (graphtype == 'colour') {
        title = 'Best colouring found by algorithm';
        yAxisTitle = 'Number of colours';
        axisTicks = {callback: function(value) {if (value % 1 === 0) {return value;}}};
    }
    else if (graphtype == 'time') {
        title = 'Average time taken by algorithm';
        yAxisTitle = 'Time taken (s)';
    }

    // draw new chart
    let newChart = new Chart(graphname, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            maintainAspectRatio: false,
            title: {
                display: true,
                text: title,
                font: {
                    size: 30
                }
            },
            hidden: false,
            scales: {
                xAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true   // minimum value will be 0.
                    },
                    scaleLabel: {
                        display: true,
                        labelString: xAxisTitle
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: axisTicks,
                    scaleLabel: {
                        display: true,
                        labelString: yAxisTitle
                    }
                }],
            },
            legend: {
                display: false,
                position: 'bottom'
            },
            ticks: {
                precision: 0
            },
            tooltips: {
                mode: 'index',
                intersect: false,
                position: 'nearest',
                titleAlign: 'center',
                callbacks: {
                    title: function(context) {
                        let n = context[0].xLabel - 1;
                        return vertex_counts[n] + ' vertices, ' + edge_counts[n] + ' edges';
                    },
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
            
                        if (label)
                            label += ': ';

                        if (graphtype == 'time')
                            label += formatTime(tooltipItem.yLabel);
                        else
                            label += tooltipItem.yLabel;
    
                        return label;
                    }
                }
            },
            hover: {
                mode: 'index',
                intersect: false
            }
        }
    })

    newChart.classList = 'dataChart';
    return newChart;
}
// format label shown when hovering a data point
function generateHoverLabels(data) {
    vertex_counts = data['vertex_counts'];
    edge_counts = data['edge_counts'];

    let hoverlabels = [];
    for (i=0; i<vertex_counts.length; i++) {
        label = vertex_counts[i] + ' vertices, ' + edge_counts[i] + ' edges'
        hoverlabels.push(label);
    }

    return hoverlabels;
}

function drawAverageChart(algorithms, graphs, data) {
    let container1 = document.getElementById('averageChartDiv');
    container1.innerHTML = '';

    let newCanvas1 = document.createElement('canvas');
    newCanvas1.id = 'averageChart';
    container1.appendChild(newCanvas1);

    let averageLabels = [];
    let averageData = [];
    let averageColours = [];
    for (a of algorithms) {
        averageLabels.push(formatAlgorithm(a));
        averageData.push({x: 1000*data[a+'_time'].reduce((a, b) => a + b, 0)/graphs, y: data[a+'_colour'].reduce((a, b) => a + b, 0)/graphs});
        averageColours.push(algorithmColours[a]);
    }

    let averageDatasets = [];
    for (let i=0; i<averageData.length; i++) {
        averageDatasets.push({
            label: averageLabels[i],
            data: [averageData[i]],
            pointStyle: 'rectRot',
            pointRadius: 6,
            pointHoverRadius: 10,
            borderColor: averageColours[i],
            backgroundColor: averageColours[i]})
    }

    const graphData1 = {
        labels: averageLabels,
        datasets: averageDatasets
    };
    
    averageChart = new Chart('averageChart', {
        type: 'scatter',
        data: graphData1,
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Average algorithm performances'
            },
            hidden: false,
            tooltips: {
                titleAlign: 'center',
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.labels[tooltipItem.datasetIndex];
                        return ' ' + label + ': ' + tooltipItem.yLabel.toFixed(2) + ' in ' + formatTime(tooltipItem.xLabel/1000, precise=true);
                    }
                }
            },
            scales: {
                xAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true   // minimum value will be 0.
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Average time taken (ms)'
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        callback: function(value) {if (value % 1 === 0) {return value;}}
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Average colouring'
                    }
                }],
            }
        }
    });

    averageChart.classList = 'dataChart';
}

function drawDonutChart(algorithms, iterations, data) {
    let container2 = document.getElementById('donutChartDiv');
    container2.innerHTML = '';

    let newCanvas2 = document.createElement('canvas');
    newCanvas2.id = 'donutChart';
    container2.appendChild(newCanvas2);

    let donutLabels = [];
    let donutData = [];
    let donutColours = [];
    for (a of algorithms) {
        donutLabels.push(formatAlgorithm(a));
        donutData.push(data[a+'_time'].reduce((a, b) => a + b, 0)*iterations);
        donutColours.push(algorithmColours[a]);
    }

    const graphData2 = {
        labels: donutLabels,
        datasets: [{
            label: donutLabels,
            data: donutData,
            backgroundColor: donutColours
        }]
    };
    
    donutChart = new Chart('donutChart', {
        type: 'doughnut',
        data: graphData2,
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false,
                position: 'left',
            },
            title: {
                display: true,
                text: 'Distribution of time spent'
            },
            hidden: false,
            tooltips: {
                callbacks: {
                  title: function(tooltipItem, data) {
                    return data['labels'][tooltipItem[0]['index']];
                  },
                  label: function(tooltipItem, data) {
                    return ' ' + formatTime(data['datasets'][0]['data'][tooltipItem['index']]);
                  },
                },
            },
            plugins: {
                legend: {
                    title: {
                        display: true,
                        text: 'Algorithms',
                    }
                }
            }
        }
    });

    donutChart.classList = 'dataChart';
}

// individual chart for table tab
const graphSelected = document.getElementById('graphSelectedDiv');
const noneSelected = document.getElementById('noneSelected');
function updateIndividualChart(graphn=null) {
    let individualLabels = [];
    let individualData = [];
    let individualColours = [];

    if (graphn != null) {
        for (a of ANALYSIS_RESULTS['algorithms']) {
            individualLabels.push(formatAlgorithm(a));
            individualData.push({x: 1000*data[a+'_time'][graphn], y: data[a+'_colour'][graphn]});
            individualColours.push(algorithmColours[a]);
        }

        updateGraphInfo(graphn);

        noneSelected.style.display = 'none';
        graphSelected.style.display = 'block';
    }
    else {
        noneSelected.style.display = 'block';
        graphSelected.style.display = 'none';
    }

    let container = document.getElementById('individualChartDiv');
    container.innerHTML = '';

    let newCanvas = document.createElement('canvas');
    newCanvas.id = 'individualChart';
    container.appendChild(newCanvas);

    let individualDatasets = [];
    for (let i=0; i<individualData.length; i++) {
        individualDatasets.push({
            label: individualLabels[i],
            data: [individualData[i]],
            pointStyle: 'rectRot',
            pointRadius: 6,
            pointHoverRadius: 10,
            borderColor: individualColours[i],
            backgroundColor: individualColours[i]})
    }

    const graphData = {
        labels: individualLabels,
        datasets: individualDatasets
    };
    
    individualChart = new Chart('individualChart', {
        type: 'scatter',
        data: graphData,
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Algorithm performances'
            },
            tooltips: {
                titleAlign: 'center',
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.labels[tooltipItem.datasetIndex];
                        return ' ' + label + ': ' + tooltipItem.yLabel + ' in ' + formatTime(tooltipItem.xLabel/1000, precise=true);
                    }
                }
            },
            scales: {
                xAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true   // minimum value will be 0.
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Time taken (ms)'
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        callback: function(value) {if (value % 1 === 0) {return value;}}
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Colouring found'
                    }
                }],
            }
        }
    });
}


// CREATE LEGEND
const legendContainer = document.getElementById('legendContainer');
function createLegend(chart) {
    legendContainer.innerHTML = chart.generateLegend();

    let datasets = chart.data.datasets;
    var legendItems = legendContainer.getElementsByTagName('li');
    for (var i=0; i<legendItems.length; i++) {
        lItem = legendItems[i]
        lItem.addEventListener("click", legendClickCallback.bind(this,i), false);

        lItem.innerHTML = '<div class="legendBlock" style="background-color:' + datasets[i].backgroundColor + '"></div>' + lItem.innerHTML;
    }
}

// https://stackoverflow.com/a/57530533
function legendClickCallback(legendItemIndex){
    // STYLE THE INDEX
    let legendItem = legendContainer.getElementsByTagName('li')[legendItemIndex];
    if (legendItem.classList == '') {
        legendItem.classList = 'charthidden';
    }
    else {
        legendItem.classList = '';
    }

    // HIDE THE DATA
    chartList = [colourChart, timeChart, averageChart];
    chartList.forEach((chartItem,index)=>{
        var dataItem = chartItem.data.datasets[legendItemIndex];
        if(dataItem.hidden == true){
            dataItem.hidden = false;
        } else {
            dataItem.hidden = true;
        }
        chartItem.update();
    });

    var dataItem = donutChart.getDatasetMeta(0).data[legendItemIndex];
    if(dataItem.hidden == true){
        dataItem.hidden = false;
    } else {
        dataItem.hidden = true;
    }
    donutChart.update();
}