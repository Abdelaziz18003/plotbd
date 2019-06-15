# plotbd
A tool to plot bifurcation diagrams using Node.js and Gnuplot.


## Installation

```bash
npm install plotbd
```

## Usage

```js
const plotbd = require('plotbd');

/*
The map should have the following pattern
- The current state x(n) as the first argument.
- The control parameter (r) as the second one.
- return the next state x(n+1)
*/
function logisticMap (x, r) {
  return r * x * (1 - x);
}

plotbd(logisticMap, {
  x0: 0.4, // [required] the initial state
  rValues: [0.1, 3.99, 1000], // [required] the control parameter [min, max, numberOfValues]
  iterations: 500, // [optional] number of iterations to do for a each r value
  density: 100 // [optional] number of "x" values to plot per "r" value.
});
```

![bifurcation-diagram](https://user-images.githubusercontent.com/11301627/59551650-7a290e00-8f74-11e9-8a6c-42120a28053c.png)

## Notes

- `density` must always be less than `iterations` because the `x` values to keep are part of iterations.
- increasing the number of `r` values `rValues[2]` and `density` will enhance the bifurcation diagram plot by adding more details. But, it will decrease the performance on the other hand.
