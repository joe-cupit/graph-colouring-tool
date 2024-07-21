import numpy as np
import math
from colouringFunctions import get_edges_and_vertices, get_ordered_adjacency_dict

# compute dij
# compute Iij
# compute kij
# initialize positions
# while (max delta > €){
# let Pm be the particle satisfying max delta
#     while (delta_m > €){
#         compute dEdx and dEdy
#         xm = xm + dEdx
#         ym = ym + dEdy
#     }
# }


# https://www.bogotobogo.com/python/python_Dijkstras_Shortest_Path_Algorithm.php
def shortestPath(v1, adjacency_dict):
    visited = set([v1])
    unvisited = list(adjacency_dict.keys())
    unvisited.remove(v1)
    unvisited.append(v1)

    distance_dict = dict()
    for vertex in adjacency_dict.keys():
        distance_dict[vertex] = float('inf')
    distance_dict[v1] = 0

    while len(unvisited):
        current = unvisited.pop()
        visited.add(current)

        dist = distance_dict[current]

        for next in adjacency_dict[current]:
            if next in visited:
                continue

            new_dist = dist + 1
            if new_dist < distance_dict[next]:
                distance_dict[next] = new_dist

        sortedbydist = sorted(distance_dict.keys(), key=lambda key: distance_dict[key], reverse=True)
        unvisited = [v for v in sortedbydist if v in unvisited]

    return distance_dict


def getShortestPaths(vertices, adjacency_dict):
    vertices = sorted(vertices)
    n = len(vertices)
    d = np.zeros((n, n))

    for i in range (n):
        vertex_distances = shortestPath(vertices[i], adjacency_dict)
        for j in range(i+1, n):
            dist = vertex_distances[vertices[j]]
            d[i][j] = dist
            d[j][i] = dist

    return d


def deltaM(m, n, x, y, l, k):
    dEdx = 0; dEdy = 0
    for i in range(n):
        if i == m:
            continue
        xmi = x[m]-x[i]; ymi = y[m]-y[i]
        kmi = k[m][i]; lmi = l[m][i]

        denominator = math.sqrt(xmi**2 + ymi**2)

        dEdx += kmi*((xmi) - (lmi*xmi)/denominator)
        dEdy += kmi*((ymi) - (lmi*ymi)/denominator)

    return np.sqrt(dEdx**2 + dEdy**2)

import networkx as nx

def organiseNX(edge_string):
    vertices, edges = get_edges_and_vertices(edge_string)

    G = nx.Graph()
    G.add_edges_from(edges)

    layout = nx.kamada_kawai_layout(G, scale=300)
    
    output = ''
    for v in vertices:
        pos = layout[v]
        output += f'{v}:{pos[0]},{pos[1]} '

    return output.strip()


def organise(edge_string):
    print('organising graph')
    vertices, edges = get_edges_and_vertices(edge_string)
    vertices = sorted(list(vertices))
    adjacency_dict = get_ordered_adjacency_dict(vertices, edges)

    n = len(vertices)
    d = getShortestPaths(vertices, adjacency_dict)     # length of shortest path from i to j

    L = 150  # desired edge length
    K = 100   # spring constant
    epsilon = 0.1

    x = np.zeros(n); y = np.zeros(n)
    theta = 2*math.pi / n
    radius = 10*n
    for i in range(n):
        x[i] = math.cos(i*theta)*radius
        y[i] = math.sin(i*theta)*radius

    l = np.zeros((n,n))
    k = np.zeros((n,n))
    # l_ij = l_ji (same for k)
    for i in range(n):
        for j in range(i+1, n):
            if i == j:
                l[i][j] = 0
                k[i][j] = 0
                continue
        
            currl = L*d[i][j]
            currk = K/(d[i][j]**2)

            l[i][j] = currl
            l[j][i] = currl
            k[i][j] = currk
            k[j][i] = currk
    
    maxDelta = float('-inf')
    maxn = None
    for i in range(n):
        newDelta = deltaM(i, n, x, y, l, k)
        if newDelta > maxDelta:
            maxDelta = newDelta
            maxn = i
    
    print('started')
    print(L, K, epsilon)
    while maxDelta > epsilon:
        mdelta = maxDelta
        m = maxn

        while mdelta > epsilon:
            dEdx = 0; dEdy = 0; dEdx2 = 0; dEdxdy = 0; dEdy2 = 0
            for i in range(n):
                if i == m:
                    continue
                xmi = x[m] - x[i]; ymi = y[m] - y[i]
                kmi = k[m][i]; lmi = l[m][i]

                denominator = math.sqrt(xmi**2 + ymi**2)

                dEdx += kmi*((xmi) - (lmi*xmi)/denominator)
                dEdy += kmi*((ymi) - (lmi*ymi)/denominator)
                dEdx2 += kmi*(1 - (lmi*(ymi**2))/denominator**3)
                dEdxdy += kmi*((lmi*xmi*ymi)/denominator**3)
                dEdy2 += kmi*(1 - (lmi*(xmi**2))/denominator**3)
            a = np.array([[dEdx2, dEdxdy], [dEdxdy, dEdy2]])
            b = np.array([-dEdx, -dEdy])
            dx, dy = np.linalg.solve(a, b)
            x[m] += dx
            y[m] += dy

            mdelta = deltaM(m, n, x, y, l, k)
            

        maxDelta = float('-inf')
        maxn = None
        for i in range(n):
            newDelta = deltaM(i, n, x, y, l, k)
            if newDelta > maxDelta:
                maxDelta = newDelta
                maxn = i
    print('done')
    
    output = ''
    for i in range(n):
        output += f'{vertices[i]}:{x[i]},{y[i]} '

    return output.strip()
