const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');

suite('Unit Tests', () => {

  const validPuzzle = '1.34567894567891.37891.3456.34567891567891.34891.3456734567891.67891.34591.345678';
  const validPuzzleSolution = validPuzzle.replace(/\./g, "2");

  suite('SudokuSolver.validate', () => {
    test('01. Valid puzzle', () => {
      // assert.isTrue(solver.validate(validPuzzle));
      const result = solver.validate(validPuzzle);
      assert.isObject(result);
      assert.propertyVal(result, 'valid', true);
    });
    test('02. Puzzle with invalid characters', () => {
      // assert.isFalse(solver.validate(validPuzzle.replace(/1/g, "X")));
      const error = solver.validate(validPuzzle.replace(/1/g, "X"));
      assert.isObject(error);
      assert.propertyVal(error, 'valid', false);
      assert.propertyVal(error, 'error', 'Invalid characters in puzzle');
    });
    test('03. Puzzle with invalid length', () => {
      // assert.isFalse(solver.validate(validPuzzle.replace(/1/g, "")));
      const error = solver.validate(validPuzzle.replace(/1/g, ""));
      assert.isObject(error);
      assert.propertyVal(error, 'valid', false);
      assert.propertyVal(error, 'error', 'Expected puzzle to be 81 characters long');
    });
  });

  suite('SudokuSolver.checkRowPlacement', () => {
    test('04. Valid row placement', () => {
      assert.isTrue(solver.checkRowPlacement(validPuzzle, 1, 2, 2));
    });
    test('05. Invalid row placement', () => {
      assert.isFalse(solver.checkRowPlacement(validPuzzle, 2, 8, 8), 'Row 2 already includes 8');
    });
  });

  suite('SudokuSolver.checkColPlacement', () => {
    test('06. Valid column placement', () => {
      assert.isTrue(solver.checkColPlacement(validPuzzle, 1, 2, 2));
    });
    test('07. Invalid column placement', () => {
      assert.isFalse(solver.checkColPlacement(validPuzzle, 2, 8, 8), 'Column 8 already includes 8');
    });
  });

  suite('SudokuSolver.checkRegionPlacement', () => {
    test('08. Valid region placement', () => {
      assert.isTrue(solver.checkRegionPlacement(validPuzzle, 1, 2, 2));
    });
    test('09. Invalid region placement', () => {
      assert.isFalse(solver.checkRegionPlacement(validPuzzle, 2, 8, 8), 'Region 1-3 already includes 8');
    });
  });

  suite('SudokuSolver.solve', () => {
    test('10. Valid (already solved) puzzle', () => {
      const testPuzzle = validPuzzleSolution;
      const solution = solver.solve(testPuzzle);
      assert.isObject(solution);
      assert.propertyVal(solution, 'solution', validPuzzleSolution);
    });
    test('11a. Puzzle with invalid characters', () => {
      const testPuzzle = validPuzzle.replace(/1/g, "X");
      const error = solver.solve(testPuzzle);
      assert.isObject(error);
      assert.propertyVal(error, 'error', 'Invalid characters in puzzle');
    });
    test('11b. Puzzle with invalid length', () => {
      const testPuzzle = validPuzzle.replace(/1/g, "");
      const error = solver.solve(testPuzzle);
      assert.isObject(error);
      assert.propertyVal(error, 'error', 'Expected puzzle to be 81 characters long');
    });
    test('11c. Puzzle with invalid row', () => {
      const testPuzzle = '.........113456789...............................................................';
      const error = solver.solve(testPuzzle);
      assert.isObject(error);
      assert.propertyVal(error, 'error', 'Puzzle cannot be solved');
    });
    test('11d. Puzzle with invalid column', () => {
      const testPuzzle = '.1........1........3........4........5........6........7........8........9.......';
      const error = solver.solve(testPuzzle);
      assert.isObject(error);
      assert.propertyVal(error, 'error', 'Puzzle cannot be solved');
    });
    test('11e. Puzzle with invalid region', () => {
      const testPuzzle = '...113......456......789.........................................................';
      const error = solver.solve(testPuzzle);
      assert.isObject(error);
      assert.propertyVal(error, 'error', 'Puzzle cannot be solved');
    });
    test('12a. Solve incomplete puzzle', () => {
      const testPuzzle = validPuzzle;
      const solution = solver.solve(testPuzzle);
      assert.isObject(solution);
      assert.propertyVal(solution, 'solution', validPuzzleSolution);
    });
    test('12b. Solve sample puzzles', () => {
      for (let puzzle = 0; puzzle < puzzlesAndSolutions.length; puzzle++) {
        const testPuzzle = puzzlesAndSolutions[puzzle][0];
        const solution = solver.solve(testPuzzle);
        assert.isObject(solution);
        assert.propertyVal(solution, 'solution', puzzlesAndSolutions[puzzle][1]);
      }
    });
  });

});
