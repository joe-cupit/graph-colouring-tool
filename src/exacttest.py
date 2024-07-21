from tkinter import Tk
from tkinter.filedialog import askopenfilename
from datetime import datetime
import time

from exhaustive import exhaustive_colouring
from contraction import addition_contraction, deletion_contraction


print(datetime.now())
print()

Tk().withdraw()
filename = askopenfilename()
print(filename)
print('-----------')

graphstring = ''
with open(filename) as f:
    for line in f:
        if line.startswith('e'):
            e, u, v = line.split()
            graphstring += f'{u},{v} '
print(graphstring)

print()
print('-----------')

print('Addition contraction')
start = time.time()
a_colouring = addition_contraction(graphstring)
a_time = time.time() -start

print(a_colouring)
print(f'colours: {a_colouring}')
print(f'time: {a_time}')


print()
print('-----------')

print('Deletion contraction')
start = time.time()
d_colouring = deletion_contraction(graphstring)
d_time = time.time() -start

print(d_colouring)
print(f'colours: {d_colouring}')
print(f'time: {d_time}')


print()
print('-----------')

print('Exhaustive')
start = time.time()
e_colouring = exhaustive_colouring(graphstring)
e_time = time.time() -start

e_colours = len(set([e_colouring[x] for x in e_colouring]))

print(e_colouring)
print(f'colours: {e_colours}')
print(f'time: {e_time}')
