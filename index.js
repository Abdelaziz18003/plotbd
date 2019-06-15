const fs = require('fs');
const {spawn} = require('child_process');

const tempDataFile = '.bifurcation-data.dat';
const defaultOptions = {
  x0: 0.4,
  rValues: [0.1, 3.99, 1000],
  iterations: 300,
  density: 100
}

function plotbd (chaoticMap, {x0, rValues, iterations, density} = defaultOptions) {
  let dataFile = fs.createWriteStream(`${tempDataFile}`);
  const [rMin, rMax, rNum] = rValues;
  iterations = iterations ? iterations : defaultOptions.iterations;
  density = density ? density : defaultOptions.density;

  for (let r = rMin; r <= rMax; r = r + (rMax - rMin) / rNum) {
    let x = x0;
    for (let i = 0; i < iterations; i++) {
      x = chaoticMap(x, r);
      if (i >= iterations - density) {
        dataFile.write(`${r} ${x}\n`);
      }
    }
  }
  dataFile.end();
  plotDataFile();
}

function plotDataFile () {
  let gnuplot = spawn('gnuplot', ['-p']);
  gnuplot.stdin.write(`plot '${tempDataFile}' with dots notitle\n`);
  gnuplot.stdin.end();
}

module.exports = plotbd;