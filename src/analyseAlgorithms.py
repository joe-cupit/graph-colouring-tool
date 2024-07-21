from greedyColouring import greedy_colouring_random, greedy_colouring_ordered, greedy_smallest_last
from DSatur import DSatur
from RLF import RLF, RLF_2
from exhaustive import exhaustive_colouring
from contraction import addition_contraction, deletion_contraction
from colouringFunctions import generate_graph
import colouringFunctions as cf

import numpy as np
import random
import time
import json


def algorithm_analysis(graphs, iterations, algorithms, graph_size, graph_density):
    graph_numbers = list(range(1,graphs+1))
    graph_deltas = np.zeros((graphs,), dtype=int)
    graph_time = np.zeros((graphs,), dtype=float)

    algorithm_times = []
    algorithm_colours = []
    algorithm_functions = []
    for i in  range(len(algorithms)):
        algorithm = algorithms[i]
        if algorithm == 'greedy-random':
            algorithm_functions.append(greedy_colouring_random)
        elif algorithm == 'greedy-ordered':
            algorithm_functions.append(greedy_colouring_ordered)
        elif algorithm == 'greedy-smallest':
            algorithm_functions.append(greedy_smallest_last)
        elif algorithm == 'DSatur':
            algorithm_functions.append(DSatur)
        elif algorithm == 'RLF':
            algorithm_functions.append(RLF)
        elif algorithm == 'exhaustive':
            algorithm_functions.append(exhaustive_colouring)
        elif algorithm == 'Acontraction':
            algorithm_functions.append(addition_contraction)
        elif algorithm == 'Dcontraction':
            algorithm_functions.append(deletion_contraction)
        algorithm_times.append(np.zeros((graphs,), dtype=float))
        algorithm_colours.append(np.zeros((graphs,), dtype=int))

    locked_vertices = False
    vertex_counts = np.linspace(graph_size[0], graph_size[1], graphs, dtype=int)
    edge_counts = np.zeros((graphs,), dtype=int)
    
    if (graph_size[0] == graph_size[1]):
        locked_vertices = True
        density_values = np.linspace(graph_density[0], graph_density[1], graphs, dtype=float)

    for i in range(graphs):
        if locked_vertices:
            densityi = density_values[i] / 100
        else:
            densityi = random.randint(graph_density[0], graph_density[1]) / 100

        vi = vertex_counts[i]
        ei = int((vi * (vi - 1) / 2 - (vi-1)) * densityi + (vi - 1))
        edge_counts[i] = ei

        start = time.time()
        graphi = generate_graph(vi, ei)
        graph_time[i] = time.time() - start

        v, e = cf.get_edges_and_vertices(graphi)
        vertex_degrees = (cf.get_ordered_adjacency_dict(v, e))
        graph_deltas[i] = len(vertex_degrees.popitem()[1])

        for j, func in enumerate(algorithm_functions):
            times = np.zeros(iterations)
            colours = np.zeros(iterations)
            for k in range(iterations):
                start = time.time()

                colDict = func(graphi)

                times[k] = time.time() - start
                try:
                    colours[k] = len(set(colDict.values()))
                except AttributeError:
                    colours[k] = colDict
            algorithm_times[j][i] = np.average(times)
            algorithm_colours[j][i] = np.min(colours)
    
    results = dict()
    results['graph_numbers'] = graph_numbers
    results['graph_deltas'] = graph_deltas.tolist()
    results['graph_time'] = graph_time.tolist()
    results['vertex_counts'] = vertex_counts.tolist()
    results['edge_counts'] = edge_counts.tolist()
    for j, algo in enumerate(algorithms):
        results[algo+'_time'] = algorithm_times[j].tolist()
        results[algo+'_colour'] = algorithm_colours[j].tolist()

    return json.dumps(results)


if __name__ == '__main__':
    results = algorithm_analysis(10, 10, ['RLF', 'DSatur', 'greedy-ordered', 'greedy-random'], [10, 50], [70, 90])
    print(results)
