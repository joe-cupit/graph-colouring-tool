import colouringFunctions as cf
from itertools import permutations, combinations_with_replacement, combinations


# returns true if the given colouring is valid
def is_valid_colouring(edges, mapping):
    for edge in edges:
        if mapping[edge[0]] == mapping[edge[1]]:
            return False

    return True


def exhaustive_colouring(edge_string):
    # separate vertices and edges from the edge string
    vertices, edges = cf.get_edges_and_vertices(edge_string)
    # print(edges)

    n = len(vertices)

    # all vertex orderings
    vertex_combinations = set(permutations(vertices))
    colour_combinations = combinations_with_replacement([i for i in range(n)], n)
    # print(list(colour_combinations))

    for combination in colour_combinations:
        for vertex_mapping in vertex_combinations:
            colDict = {vertex_mapping[i]: combination[i] for i in range(n)}
            if is_valid_colouring(edges, colDict):
                return colDict
                
    return {vertices[i]: i for i in range(n)}

    # for each colouring and vertex ordering check if it is valid and return it
    for combination in colour_combinations:
        for permutation in permutations(combination):
            # print(permutation)
            colDict = {str(i+1): permutation[i] for i in range(n)}
            if is_valid_colouring(edges, colDict):
                return colDict
    
    # if no colouring is found return a unique colour for each vertex
    return {vertices[i]: i for i in range(n)}


    colour_combinations = combinations_with_replacement([i for i in range(n)], n)
    for i in range(n):
        col_combs = combinations_with_replacement([i for i in range(i)], n)
        print(i)
        for comb in col_combs:
            if len(set(comb)) < i:
                continue
            else:
                print(comb)

    print(list(colour_combinations))


if __name__ == '__main__':
    print(exhaustive_colouring('1,2 2,3 3,4 1,4'))
