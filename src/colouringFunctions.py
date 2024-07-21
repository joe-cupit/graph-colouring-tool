import random


# Returns a random graph given a number of vertices and edges
def generate_graph_old(vertex_count, edge_count):
    min_edges = vertex_count-1
    max_edges = vertex_count*(vertex_count-1)/2
    if edge_count < min_edges:
        edge_count = min_edges
    elif edge_count > max_edges:
        edge_count = max_edges

    E = []
    # add at least 1 edge to each vertex to ensure connectedness
    for v in range(2, vertex_count+1):
        u = random.randint(1, v-1)
        E.append((u, v))   # u < v  in all cases

    mistakes = 0
    # add remaining edges randomly
    while len(E) < edge_count:
        v = random.randint(1, vertex_count)
        u = random.randint(1, vertex_count)
        while u == v:
            mistakes += 1
            u = random.randint(1, vertex_count)

        e = tuple(sorted((u, v)))
        if e not in E:
            E.append(e)
        else:
            mistakes += 1

    return ' '.join([','.join(map(str, e)) for e in E]), mistakes

def generate_graph(vertex_count, edge_count):
    min_edges = vertex_count-1
    max_edges = vertex_count*(vertex_count-1)/2
    if edge_count < min_edges:
        edge_count = min_edges
    elif edge_count > max_edges:
        edge_count = max_edges

    vertices = set(range(1, vertex_count+1))

    adjacency_dict = {}
    for v in vertices:
        adjacency_dict[v] = set([v])

    E = []
    # add at least 1 edge to each vertex to ensure connectedness
    for v in range(2, vertex_count+1):
        u = random.randint(1, v-1)
        E.append((u, v))   # u < v  in all cases
        adjacency_dict[u].add(v)
        adjacency_dict[v].add(u)

    # add remaining edges randomly
    while len(E) < edge_count:
        v = random.choice(list(vertices))
        available = list(vertices - adjacency_dict[v])
        if len(available) == 0:
            vertices.remove(v)
            continue
        u = random.choice(available)

        adjacency_dict[u].add(v)
        adjacency_dict[v].add(u)

        E.append(sorted((u, v)))

    return ' '.join([','.join(map(str, e)) for e in E])


# Returns a string version of a colour dictionary
def col_dict_to_string(colDict):
    colStr = ''
    for vnum in colDict:
        colStr += str(vnum) + ':' + str(colDict[vnum]) + ' '

    return colStr.strip()


# Returns a list of vertices and edges given a string of just edges
def get_edges_and_vertices(edge_string):
    vertexSet = set()
    edges = []
    for e in edge_string.strip().split(' '):
        v1, v2 = e.split(',')
        edges.append([v1, v2])
        vertexSet.add(v1)
        vertexSet.add(v2)

    return list(vertexSet), edges


# Returns the degree of the given vertex
def get_vertex_degree(vertex, edges):
    degree = 0
    for edge in edges:
        if vertex in edge:
            degree += 1
    return degree


# Returns a list of neighbours for a given vertex
def get_vertex_neighbours(vertex, edges):
    neighbors = []
    for edge in edges:
        if edge[0] == vertex:
            neighbors.append(edge[1])
        elif edge[1] == vertex:
            neighbors.append(edge[0])

    return neighbors


def get_ordered_adjacency_dict(vertices, edges):
    vertex_neighbours = {}
    for v in vertices:
        vertex_neighbours[v] = get_vertex_neighbours(v, edges)
    return dict(sorted(vertex_neighbours.items(), key=lambda x: len(x[1]), reverse=True))


# Returns the lowest number not in the given list
def get_lowest_allowed_colour(illegal_col_list):
    colour = 0
    while colour in illegal_col_list:
        colour += 1
    return colour
