import colouringFunctions as cf


def DSatur(edge_string):
    # separate vertices and edges from the edge string
    vertices, edges = cf.get_edges_and_vertices(edge_string)

    # create dictionary of vertices with a list of its neighbours
    vertex_neighbours = {}
    for v in vertices:
        vertex_neighbours[v] = cf.get_vertex_neighbours(v, edges)

    # list of vertices, items look like [vertex name, degree of saturation, list of neighbours]
    vertices = sorted([[v, set(), vertex_neighbours[v]] for v in vertex_neighbours], key=lambda x: (-len(x[1]), -len(x[2])))

    colDict = {}   # dictionary for vertex colourings
    while vertices:
        # select the vertex of maximum saturation
        v, _, _ = vertices.pop(0)

        # give the vertex the lowest colour it's not adjacent to
        illegal_col_list = [colDict[a] for a in vertex_neighbours[v] if a in colDict]
        newcol = cf.get_lowest_allowed_colour(illegal_col_list)
        colDict[v] = newcol

        # update the saturations for the vertices and reorder
        vertices = update_saturations(vertices, v, newcol)
        vertices = sorted(vertices, key=lambda x: (-len(x[1]), -len(x[2])))
    
    return colDict


# updates the saturation of each vertex
def update_saturations(vertices, coloured_vertex, colour):
    for i in range(len(vertices)):
        # if the newly coloured vertex is adjacent to the vertex
        # its degree of saturation is increased
        if coloured_vertex in vertices[i][2]:
            vertices[i][1].add(colour)

    return vertices
