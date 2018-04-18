import numpy as np
import matplotlib.pyplot as plt

param = json.load(open('data/parameters.json'))

def calculate_dist(bundles, values):

    min_factor = 0.01
    bundles_param = [param[b] for b in bundles]
    sample_size = 25000

    np.random.seed(0)
    samples = np.concatenate(
        [-min_factor * v + np.random.beta(float(u['alpha']), float(u['beta']), sample_size) * v
         for (u, v) in zip(bundles_param, values)])

    return samples

x = calculate_dist([2,3,17], [54597, 138378, 327869])
plt.hist(x, normed=True, bins=20)
plt.show()
print(x.min(), x.max())