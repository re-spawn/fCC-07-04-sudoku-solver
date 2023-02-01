'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      let value = req.body.value;
      if (puzzle == undefined ||
          coordinate == undefined ||
          value == undefined) {
        res.json({
          valid: false,
          error: 'Required field(s) missing'
        });
      } else if (coordinate.search(/^[A-I][1-9]$/) == -1) {
        res.json({
          valid: false,
          error: 'Invalid coordinate'
        });
      } else if (isNaN(value) || value < 1 || value > 9) {
        res.json({
          valid: false,
          error: 'Invalid value'
        });
      } else {
        const result = solver.validate(puzzle);
        if (result.valid == false) {
          res.json(result);
        } else {
          const row = coordinate.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
          const column = Number.parseInt(coordinate.substr(1, 1));
          value = Number.parseInt(value);
          let valid = true;
          const conflicts = [];
          if (solver.checkRowPlacement(puzzle, row, column, value) == false) {
            valid = false;
            conflicts.push('row');
          }
          if (solver.checkColPlacement(puzzle, row, column, value) == false) {
            valid = false;
            conflicts.push('column');
          }
          if (solver.checkRegionPlacement(puzzle, row, column, value) == false) {
            valid = false;
            conflicts.push('region');
          }
          if (valid) {
            res.json({
              valid: valid
            });
          } else {
            res.json({
              valid: valid,
              conflict: conflicts
            });
          }
        }
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if (puzzle == undefined) {
        res.json({
          error: 'Required field missing'
        });
      } else {
        // res.json(solver.solve(puzzle));
        const solution = solver.solve(puzzle);
        res.json(solution);
      }
    });
};
