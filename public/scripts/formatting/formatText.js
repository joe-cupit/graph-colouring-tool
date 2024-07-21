function formatAlgorithm(algo) {
    fullTitle = '';
    switch (algo) {
        case 'greedy-random':
            return 'Greedy Colouring (Random)';
        case 'greedy-ordered':
            return 'Greedy Colouring (by Degree)';
        case 'greedy-smallest':
            return 'Greedy Colouring (Smallest Last)';
        case 'DSatur':
            return 'DSatur';
        case 'RLF':
            return 'Recursive Largest First';
        case 'exhaustive':
            return 'Exhaustive Colouring';
        case 'Acontraction':
            return 'Addition Contraction'
        case 'Dcontraction':
            return 'Deletion Contraction'
        default:
            return algo;
    }
}


function getAlgorithmDesc(algo) {
    switch (algo) {
        case 'greedy-random':
            return 'Consider the vertices in a random order and assign the lowest colour it is not already adjacent to.';
        case 'greedy-ordered':
            return 'Consider the vertices in descending order of their degrees and assign the lowest colour it is not already adjacent to.';
        case 'greedy-smallest':
            return 'Select the vertices by repeatedly choosing the smallest degree and removing it from the graph, then greedy colour in reverse.';
        case 'DSatur':
            return 'Select the vertex that has the largest <b title="The number of different adjacent colours" style="cursor: default">degree of saturation</b> and assign it the first colour it is not already adjacent to.';
        case 'RLF':
            return 'Assign colours one by one by repeatedly selecting the largest group of non-adjacent vertices.';
        case 'exhaustive':
            return 'Try every possible colouring combination of increasing amount until a valid one is found.';
        case 'Acontraction':
            return 'Recursively add and contract edges in the graph to calculate the <b title="The smallest number of colours the graph can be coloured by" style="cursor: default">chromatic number</b>.';
        case 'Dcontraction':
            return 'Recursively colour smaller and smaller sections of the graph to calculate the <b title="The smallest number of colours the graph can be coloured by" style="cursor: default">chromatic number</b>.';
        default:
            return '';
    }
}


function formatTime(time, precise=false) {
    timeTaken = parseFloat(time)*1000;
    if (timeTaken < 1 && !precise) {
        return '<1ms';
    }
    else if (timeTaken < 1000) {
        if (precise) {
            return timeTaken.toFixed(1) + 'ms';
        }
        return timeTaken.toFixed(0) + 'ms';
    }
    else if (timeTaken / 1000 > 60) {
        if (Math.floor((timeTaken/1000)%60 == 0)) {
            return Math.floor(timeTaken/60000) + 'mins';
        }
        return Math.floor(timeTaken/60000) + 'mins ' + Math.floor((timeTaken/1000)%60) + 's';
    }
    else {
        if (precise) {
            return (timeTaken/1000).toFixed(2) + 's';
        }
        return (timeTaken/1000).toFixed(1) + 's';
    }
}

function formatLongTime(time) {
    timeTaken = parseFloat(time);

    if (timeTaken < 1.5) {
        return '~1 sec';
    }
    else if (timeTaken < 60) {
        return '~'+timeTaken.toFixed(0)+' secs';
    }
    else if (timeTaken < 90) {
        return '~1 min'
    }
    else {
        return '~'+(timeTaken/60).toFixed(0) + ' mins';
    }
}
