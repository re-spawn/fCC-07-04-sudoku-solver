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

  const validPuzzle = '1.34567894567891.37891.3456.34567891567891.34891.3456734567891.67891.34591.345678';
  const validPuzzleSolution = validPuzzle.replace(/\./g, "2");

  suite('Solve', () => {
    const route = '/api/solve';
    test('01a. Solve puzzle with valid puzzle string', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: validPuzzle
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'solution', validPuzzleSolution);
          }
          done();
        });
    });
    test('01b. Solve puzzle with valid puzzle string', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'solution', '769235418851496372432178956174569283395842761628713549283657194516924837947381625');
          }
          done();
        });
    });
    test('02. Solve puzzle with missing puzzle string', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'error', 'Required field missing');
          }
          done();
        });
    });
    test('03. Solve puzzle with invalid characters in puzzle string', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: validPuzzle.replace(/1/g, "X")
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'error', 'Invalid characters in puzzle');
          }
          done();
        });
    });
    test('04a. Solve puzzle with empty puzzle string', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: ""
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'error', 'Expected puzzle to be 81 characters long');
          }
          done();
        });
    });
    test('04b. Solve puzzle with invalid length puzzle string', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: validPuzzle.replace(/1/g, "")
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'error', 'Expected puzzle to be 81 characters long');
          }
          done();
        });
    });
    test('05. Solve invalid puzzle', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: validPuzzle.replace(/1/g, "3")
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'error', 'Puzzle cannot be solved');
          }
          done();
        });
    });
  });

  suite('Check', () => {
    const route = '/api/check';
    test('06. Check puzzle placement with all fields', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: validPuzzle,
          coordinate: 'A2',
          value: 2
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'valid', true);
          }
          done();
        });
    });
    test('07. Check puzzle placement with single placement conflict', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: '1................................................................................',
          coordinate: 'A4',
          value: 1
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'valid', false);
            assert.deepPropertyVal(res.body, 'conflict', ['row']);
          }
          done();
        });
    });
    test('08. Check puzzle placement with multiple placement conflicts', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: '1................................................................................',
          coordinate: 'A3',
          value: 1
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'valid', false);
            assert.deepPropertyVal(res.body, 'conflict', ['row', 'region']);
          }
          done();
        });
    });
    test('09. Check puzzle placement with all placement conflicts', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: '1............................1...................................................',
          coordinate: 'A3',
          value: 1
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'valid', false);
            assert.deepPropertyVal(res.body, 'conflict', ['row', 'column', 'region']);
          }
          done();
        });
    });
    test('10. Check puzzle placement with missing required fields', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: validPuzzle,
          coordinate: 'A2'
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'valid', false);
            assert.propertyVal(res.body, 'error', 'Required field(s) missing');
          }
          done();
        });
    });
    test('11. Check puzzle placement with invalid characters', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: validPuzzle.replace(/1/g, "X"),
          coordinate: 'A2',
          value: 2
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'valid', false);
            assert.propertyVal(res.body, 'error', 'Invalid characters in puzzle');
          }
          done();
        });
    });
    test('12. Check puzzle placement with incorrect length', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: validPuzzle.replace(/1/g, ""),
          coordinate: 'A2',
          value: 2
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'valid', false);
            assert.propertyVal(res.body, 'error', 'Expected puzzle to be 81 characters long');
          }
          done();
        });
    });
    test('13. Check puzzle placement with invalid placement coordinate', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: validPuzzle.replace(/1/g, ""),
          coordinate: '2A',
          value: 2
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'valid', false);
            assert.propertyVal(res.body, 'error', 'Invalid coordinate');
          }
          done();
        });
    });
    test('14. Check puzzle placement with invalid placement value', (done) => {
      chai
        .request(server)
        .post(route)
        .type('form')
        .send({
          puzzle: validPuzzle.replace(/1/g, ""),
          coordinate: 'A2',
          value: 100
        })
        .end((err, res) => {
          if (err) {
            console.error(err);
          } else {
            assert.strictEqual(res.status, 200);
            assert.propertyVal(res.body, 'valid', false);
            assert.propertyVal(res.body, 'error', 'Invalid value');
          }
          done();
        });
    });
  });

});
