const fs = require('fs');
const {spawn} = require('child_process');
const {tempDataFile} = require('./config');

function _clearDataFile () {
  fs.unlinkSync(`${tempDataFile}`);
}

module.exports.validateOptions = function (options) {
  const missingRequiredFields = !options.x0 || !options.rValues;
  const optionsNotValid = 
    options.rValues.length !== 3 ||
    options.rValues[0] > options.rValues[1] ||
    options.density > options.iterations

  if (missingRequiredFields) {
    throw new Error('x0 and rValues fields are required');
  }
  if (optionsNotValid) {
    throw new Error('One or more options fields are not valid');
  }
}

module.exports.generateDataFile = function (chaoticMap, options) {
  let {x0, rValues, iterations, density} = options;
  let [rMin, rMax, rNum] = rValues;
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
  return dataFile;
}

module.exports.plotDataFile = function ({rValues}) {
  let gnuplot = spawn('gnuplot', ['-p']);
  gnuplot.stdin.write(`set xrange [${rValues[0]}: ${rValues[1]}]\n`);
  gnuplot.stdin.write(`plot '${tempDataFile}' with dots notitle\n`);
  gnuplot.stdin.end();
  gnuplot.on('exit', () => {
    _clearDataFile();
  })
}
