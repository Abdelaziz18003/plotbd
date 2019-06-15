const fs = require('fs');
const {validateOptions, generateDataFile, plotDataFile} = require('./helpers');
const {tempDataFile, defaultOptions} = require('./config');

/**
 * 
 * @param {String} chaoticMap 
 * @param {Object} options 
 */

function plotbd (chaoticMap, options) {
  options = Object.assign({}, defaultOptions, options);
  validateOptions(options);
  let dataFile = generateDataFile(chaoticMap, options);
  dataFile.on('close', () => {
    plotDataFile(options);
  })
}

module.exports = plotbd;