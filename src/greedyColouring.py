import colouringFunctions as cf
import random


def greedy_colouring(vertices, edges):
    colDict = {}   # dictionary for vertex colourings

    for v in vertices:
        # create a list of colours the vertex is adjacent to
        illegal_col = []
        for e in edges:
            if e[0] == v and e[1] in colDict:
                illegal_col.append(colDict[e[1]])
            elif e[1] == v and e[0] in colDict:
                illegal_col.append(colDict[e[0]])

        # assign the lowest colour it's not adjacent to
        colDict[v] = cf.get_lowest_allowed_colour(illegal_col)

    return colDict


def greedy_colouring_random(edge_string):
    vertices, edges = cf.get_edges_and_vertices(edge_string)

    # randomise vertex order
    random.shuffle(vertices)

    # perform greedy colouring
    return greedy_colouring(vertices, edges)


def greedy_colouring_ordered(edge_string):
    vertices, edges = cf.get_edges_and_vertices(edge_string)

    # order vertices by degree
    vertex_degrees = {}
    for v in vertices:
        vertex_degrees[v] = cf.get_vertex_degree(v, edges)
    vertices = sorted(vertex_degrees, key=vertex_degrees.get, reverse=True)

    # perform greedy colouring
    return greedy_colouring(vertices, edges)


def greedy_smallest_last(edge_string):
    vertices, edges = cf.get_edges_and_vertices(edge_string)
    n = len(vertices)

    # create dictionary of verties and lists of neighbours
    vertex_neighbours = {}
    for v in vertices:
        vertex_neighbours[v] = cf.get_vertex_neighbours(v, edges)

    vertices_ordered = []
    while (len(vertices_ordered) < n):
        # add the vertex with the smallest degree
        smallest = sorted(vertices, key=lambda x: len(vertex_neighbours[x]))[0]
        vertices_ordered.append(smallest)

        # remove the selected vertex from the graph
        vertices.remove(smallest)
        for v in vertices:
            try:
                vertex_neighbours[v].remove(smallest)
            except ValueError:
                continue

    # reverse the list to make is 'smallest last'
    vertices_ordered.reverse()

    # perform greedy colouring
    return greedy_colouring(vertices_ordered, edges)
