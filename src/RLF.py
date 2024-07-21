import colouringFunctions as cf


def RLF(edge_string):
    # separate vertices and edges from the edge string
    vertices, edges = cf.get_edges_and_vertices(edge_string)

    colDict = {}   # dictionary for vertex colourings
    adjacency = cf.get_ordered_adjacency_dict(vertices, edges)

    # loop through the maximal sets of the graph and apply colours to the vertices
    colour = 0
    while len(vertices) > 0:
        next_set, vertices, adjacency = maximal_independent_set(vertices, adjacency)
        for v in next_set:
            colDict[v] = colour
        colour += 1

    return colDict


# find the minimal independent set given vertices and edges
def maximal_independent_set(vertices, adjacency):
    adjacency = dict(sorted(adjacency.items(), key=lambda x: len(x[1]), reverse=True))

    # first element in the list is the vertex with the most neighbours
    first_vertex = list(adjacency)[0]
    maximal_set = [first_vertex]
    vertices.remove(first_vertex)
    adjacent_to_max_set = set(adjacency[first_vertex])
    del adjacency[first_vertex]

    # loop until the set can no longer have any more vertices added
    maximal = False
    while not maximal:
        # dictionary to keep track of the number of neighbours a vertex has
        # that are adjacent to vertices in the maximal set 
        adjacent_in_max_set = {}

        for vertex in vertices:
            # if the vertex is adjacent to the current maximal set, continue to next vertex
            if vertex in adjacent_to_max_set:
                continue
            # if it's not, calculate how many of its neighbours are adjacent to the maximal set
            else:
                adjacent_in_max_set[vertex] = len(adjacent_to_max_set.intersection(adjacency[vertex]))

        # if there are vertices available to add to the maximal set
        # and add the vertex that has the most neighbours adjacent to the maximal set
        if len(adjacent_in_max_set) > 0:
            next_vertex = max(adjacent_in_max_set, key=adjacent_in_max_set.get)
            maximal_set.append(next_vertex)
            vertices.remove(next_vertex)
            adjacent_to_max_set = adjacent_to_max_set.union(adjacency[next_vertex])
            del adjacency[next_vertex]
        # otherwise the set must be full and the loop can stop
        else:
            maximal = True
    
    new_adjacency = {}
    for v in vertices:
        new_adjacency[v] = [n for n in adjacency[v] if n in vertices]

    # return the maximal set and new reduced set of vertices
    return maximal_set, vertices, new_adjacency


def RLF_2(edge_string):
    # separate vertices and edges from the edge string
    vertices, edges = cf.get_edges_and_vertices(edge_string)

    colDict = {}   # dictionary for vertex colourings

    # loop through the maximal sets of the graph and apply colours to the vertices
    colour = 0
    while len(vertices) > 0:
        next_set, vertices = maximal_independent_set_old(vertices, edges)
        for v in next_set:
            colDict[v] = colour
        colour += 1

    return colDict


# find the minimal independent set given vertices and edges
def maximal_independent_set_old(vertices, edges):
    adjacency = cf.get_ordered_adjacency_dict(vertices, edges)

    # first element in the list is the vertex with the most neighbours
    first_vertex = list(adjacency)[0]
    maximal_set = [first_vertex]
    vertices.remove(first_vertex)

    # loop until the set can no longer have any more vertices added
    maximal = False
    while not maximal:
        # dictionary to keep track of the number of neighbours a vertex has
        # that are adjacent to vertices in the maximal set 
        adjacent_in_max_set = {}

        for vertex in vertices:
            # if the vertex is adjacent to the current maximal set, continue to next vertex
            if sets_share_vertices(adjacency[vertex], maximal_set):
                continue
            # if it's not, calculate how many of its neighbours are adjacent to the maximal set
            else:
                adjacent_in_max_set[vertex] = 0
                for neighbour in adjacency[vertex]:
                    if neighbour in vertices and sets_share_vertices(adjacency[neighbour], maximal_set):
                        adjacent_in_max_set[vertex] += 1

        # if there are vertices available to add to the maximal set
        # and add the vertex that has the most neighbours adjacent to the maximal set
        if len(adjacent_in_max_set) > 0:
            next_vertex = max(adjacent_in_max_set, key=adjacent_in_max_set.get)
            maximal_set.append(next_vertex)
            vertices.remove(next_vertex)
        # otherwise the set must be full and the loop can stop
        else:
            maximal = True
    
    # return the maximal set and new reduced set of vertices
    return maximal_set, vertices


# returns true if two sets share an element
# used to check if vertices are adjacent to the maximal set
def sets_share_vertices(set1, set2):
    return not set(set1).isdisjoint(set2)


if __name__ == '__main__':
    print(RLF('1,6 2,3 2,5 3,4 3,5 4,6 5,6'))
