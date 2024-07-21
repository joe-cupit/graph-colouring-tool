import colouringFunctions as cf
import random
import numpy as np


def deletion_contraction(edge_string):
    # separate vertices and edges from the edge string
    vertices, edges = cf.get_edges_and_vertices(edge_string)
    n = len(vertices)

    # get the chromatic polynomial for the graph
    polynomial = Dcontraction(edges, n)
    # print(polynomial)
    polynomial.reverse()
    
    # return the index of the first positive coefficient
    for k in range(1, n+1):
        if np.polyval(polynomial, k) > 0:
            return k
    return n


# recursive function to find the chromatic polynomial for a graph
def Dcontraction(edges, n):
    # base case: when there are no edges the chromatic polynomial is x^n
    if len(edges) == 0:
        polynomial = [0 for i in range(n+1)]
        polynomial[-1] = 1
        return polynomial
    # recursion: select a random edge, a graphs chromatic polynomial is equal to
    # the polynomial of the graph with the edge removed
    # minus the polynomial of the graph with the edge contracted
    else:
        new_edge = random.choice(edges)
        contracted_edges = contract_edge_simple(edges, new_edge)
        deleted_edges = delete_edge(edges, new_edge)
        return elementwiseSubtract(Dcontraction(deleted_edges, n), Dcontraction(contracted_edges, n-1))


# contracts a given edge and returns the new edges
def contract_edge_simple(edges, edge):
    v1, v2 = edge   # the vertices to be contracted together

    new_edges = []
    for e in edges:
        if e == edge:
            continue

        # v2 is renamed to v1 in all edges
        e1, e2 = e
        if e1 == v2:
            e1 = v1
        elif e2 == v2:
            e2 = v1
        new_edge = [e1, e2]

        # add the edge as a new edge if it is valid
        if (new_edge not in new_edges) and ([e2, e1] not in new_edges) and e[0] != e[1]:
            new_edges.append(new_edge)

    return new_edges


# delete a given edge and return the new list of edges
def delete_edge(edges, edge):
    new_edges = list(edges)
    new_edges.remove(edge)
    return new_edges


# subtract two polynomial lists element by element
def elementwiseSubtract(list1, list2):
    l = max(len(list1), len(list2))
    polynomial = [0 for i in range(l)]
    for i in range(0, l):
        if (i >= len(list1)):
            polynomial[i] = -list2[i]
        elif (i >= len(list2)):
            polynomial[i] = list1[i]
        else:
            polynomial[i] = list1[i] - list2[i]
    return polynomial



def addition_contraction(edge_string):
    # separate vertices and edges from the edge string
    vertices, edges = cf.get_edges_and_vertices(edge_string)
    
    return Acontraction(edges, vertices)


# recursive function to find the chromatic number of a graph
def Acontraction(edges, vertices):
    n = len(vertices)
    # base case: if the number of edges is maximal it is a complete graph
    # and the chromatic number is equal to the number of vertices
    if len(edges) == (n*(n-1)) / 2:
        return n
    # recursion: select two random vertices not already connected,
    # the chromatic number of the graph is the minimum of
    # the chromatic number of the graph where the vertices are contracted
    # and the chromatic number of the graph where an edge is drawn between them
    else:
        v1 = random.choice(vertices)
        v2 = random.choice(vertices)
        while (v1 == v2) or ([v1, v2] in edges) or ([v2, v1] in edges):
            v1 = random.choice(vertices)
            v2 = random.choice(vertices)

        contracted_edges, contracted_vertices = contract_edge(edges, vertices, [v1, v2])
        added_edges, added_vertices = add_edge(edges, vertices, [v1, v2])
        return min(Acontraction(contracted_edges, contracted_vertices), Acontraction(added_edges, added_vertices))


# connect two given vertices and return the new edges
def add_edge(edges, vertices, edge):
    new_edges = list(edges)
    new_edges.append(edge)
    return new_edges, vertices


# contract two given vertices and return the new edges and vertices
def contract_edge(edges, vertices, edge):
    v1, v2 = edge   # the vertices to be contracted together

    # remove the v2 from the list of vertices, it will be renamed to v1
    new_vertices = list(vertices)
    new_vertices.remove(v2)

    # v2 is renamed to v1 in all edges
    new_edges = []
    for e in edges:
        e1, e2 = e
        if e1 == v2:
            e1 = v1
        elif e2 == v2:
            e2 = v1

        # add the edge as a new edge if it is valid
        if (e1 != e2) and ([e1, e2] not in new_edges) and ([e2, e1] not in new_edges):
            new_edges.append([e1, e2])

    return new_edges, new_vertices


if __name__ == '__main__':
    # print(contract_edge([[1,2], [2,3], [2,4], [4,5]], [2,3]))
    # print(elementwiseSubtract([2, 2, 2, 2, 2], [0, 3, 4, 5]))
    print(addition_contraction('1,2 1,3 1,4 2,3 2,5 3,4 4,5'))
    print(deletion_contraction('1,2 1,3 1,4 2,3 2,5 3,4 4,5'))
