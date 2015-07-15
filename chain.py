import numpy as np
import random
import copy

def subsets(n):
    chain = random.sample(range(1, n+1), n)
    maxSubsetCount = 0
    subsetCount = 0
    last = len(chain) - 1
    for i,num in enumerate(chain):
        upTo = np.array(chain[0:i])
        comp = np.concatenate([np.subtract(upTo, 1), np.add(upTo, 1)])
        inSet = np.in1d(comp,[num])
        trues = np.sum(inSet)
        if i == 0 or trues == 0:
            subsetCount += 1
            if subsetCount > maxSubsetCount:
                maxSubsetCount = copy.copy(subsetCount)
        elif trues == 2 and i != last:
            subsetCount -= 1
    return maxSubsetCount

#s = [subsets(8) for x in range(100000)]
#s = [subsets(16) for x in range(100000)]
s = [subsets(32) for x in range(100000)]
mean = np.mean(s, dtype=np.float64)
std = np.std(s, dtype=np.float64)
print('mean: %.10f' % mean)
print('std: %.10f' % std)
