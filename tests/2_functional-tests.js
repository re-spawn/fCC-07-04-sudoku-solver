const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

// const server = require('../server');
require('dotenv').config();
if (process.env.HOST === 'repl') {
  var server = 'https://fCC-07-04-sudoku-solver.respawn709.repl.co';
} else {
  var server = require('../server');
}

chai.use(chaiHttp);

suite('Functional Tests', () => {

});

