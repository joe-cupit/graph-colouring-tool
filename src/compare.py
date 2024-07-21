import colouringFunctions as cf
from greedyColouring import greedy_colouring_random, greedy_colouring_ordered, greedy_smallest_last
from DSatur import DSatur
from RLF import RLF
from exhaustive import exhaustive_colouring
from contraction import addition_contraction, deletion_contraction
from organiseGraph import organise
from analyseAlgorithms import algorithm_analysis

import jgrapht
import time

vertexcount = 500
edgecount = vertexcount + (vertexcount*(vertexcount-1)/2 - (vertexcount-1)) / 2

mycolours = []
mytime = []
jgcolours = []
jgtime = []

for i in range(50):
    edge_string = cf.generate_graph(vertexcount, edgecount)
    edge_list = [(int(e.split(',')[0]),int(e.split(',')[1])) for e in edge_string.split()]

    vertex_set = set()
    for e in edge_list:
        vertex_set.add(int(e[0]))
        vertex_set.add(int(e[1]))

    jg = jgrapht.create_graph()
    jg.add_vertices_from(vertex_set)
    jg.add_edges_from(edge_list)
    
    start = time.time()
    mecolour = greedy_colouring_ordered(edge_string)
    total = time.time() - start
    mycolours.append(len(set([mecolour[x] for x in mecolour])))
    mytime.append(total)

    start = time.time()
    jgcolour = jgrapht.algorithms.coloring.greedy_largestdegreefirst(jg)
    total = time.time() - start
    jgcolours.append(jgcolour[0])
    jgtime.append(total)

    print(i)


print('me')
print(mycolours)
print(mytime)
print('jg')
print(jgcolours)
print(jgtime)
