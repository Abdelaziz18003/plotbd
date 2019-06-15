const fs = require('fs');
const {spawn} = require('child_process');

const tempDataFile = '.bifurcation-data.dat';
const defaultOptions = {
  x0: 0.4,
  rValues: [0.1, 3.99, 1000],
  iterations: 300,
  density: 100
}

/**
 * 
 * @param {String} chaoticMap 
 * @param {Object} options 
 */

function plotbd (chaoticMap, options = defaultOptions) {
  let {x0, rValues, iterations, density} = options;
  let [rMin, rMax, rNum] = rValues;
  iterations = iterations ? iterations : defaultOptions.iterations;
  density = density ? density : defaultOptions.density;
  
  let dataFile = fs.createWriteStream(`${tempDataFile}`);
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
  dataFile.on('close', () => {
    plotDataFile(options);
  })
}

function plotDataFile ({rValues}) {
  let gnuplot = spawn('gnuplot', ['-p']);
  gnuplot.stdin.write(`set xrange [${rValues[0]}: ${rValues[1]}]\n`);
  gnuplot.stdin.write(`plot '${tempDataFile}' with dots notitle\n`);
  gnuplot.stdin.end();
  gnuplot.on('exit', () => {
    clearDataFile();
  })
}

function clearDataFile () {
  fs.unlinkSync(`${tempDataFile}`);
}

module.exports = plotbd;