class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.search(/[^1-9\.]/) != -1) {
      return {
        valid: false,
        error: 'Invalid characters in puzzle'
      };
    }
    if (puzzleString.length != 81) {
      return {
        valid: false,
        error: 'Expected puzzle to be 81 characters long'
      };
    }
    return {
      valid: true
    };
  }

  insertPlaceholderIntoPuzzleString(puzzleString, row, column) {
    return (
      puzzleString.slice(0, (row - 1) * 9 + (column - 1)) +
      '.' +
      puzzleString.slice((row - 1) * 9 + (column - 1) + 1)
    );
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const puzzleStringWithPlaceholder =
      this.insertPlaceholderIntoPuzzleString(puzzleString, row, column);
    const puzzleRowWithPlaceholder =
      [...(puzzleStringWithPlaceholder.substr((row - 1) * 9, 9))];
    if (puzzleRowWithPlaceholder.includes(value.toString())) {
      return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const puzzleStringWithPlaceholder =
      this.insertPlaceholderIntoPuzzleString(puzzleString, row, column);
    const puzzleColumnWithPlaceholder = [];
    for (let r = 1; r <= 9; r++) {
      puzzleColumnWithPlaceholder.push(
        puzzleStringWithPlaceholder.charAt((r - 1) * 9 + (column - 1))
      );
    }
    if (puzzleColumnWithPlaceholder.includes(value.toString())) {
      return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const puzzleStringWithPlaceholder =
      this.insertPlaceholderIntoPuzzleString(puzzleString, row, column);
    const firstRowOfRegion = (Math.floor((row - 1) / 3) * 3) + 1;
    const firstColumnOfRegion = (Math.floor((column - 1) / 3) * 3) + 1;
    let puzzleRegionWithPlaceholder = [];
    for (let r = 1; r <= 3; r++) {
      puzzleRegionWithPlaceholder = puzzleRegionWithPlaceholder.concat(
        [...(puzzleStringWithPlaceholder.substr(
          ((firstRowOfRegion - 1) + (r - 1)) * 9 + (firstColumnOfRegion - 1), 3)
        )]
      );
    }
    if (puzzleRegionWithPlaceholder.includes(value.toString())) {
      return false;
    }
    return true;
  }

  checkPlacement(puzzleString, row, column, value) {
    return (this.checkRowPlacement(puzzleString, row, column, value) &&
            this.checkColPlacement(puzzleString, row, column, value) &&
            this.checkRegionPlacement(puzzleString, row, column, value))
  }

  getPlaceholdersWithValues(puzzleString) {
    const placeholders = [];
    for (let i = 0; i < 81; i++) {
      if (puzzleString.charAt(i) == '.') {
        const row = Math.floor(i / 9) + 1;
        const column = (i % 9) + 1;
        const values = [];
        for (let v = 1; v <= 9; v++) {
          if (this.checkPlacement(puzzleString, row, column, v)) {
            values.push(v);
          }
        }
        placeholders.push({
          row: row,
          column: column,
          value: '.',
          values: values
        });
      }
    }
    return placeholders;
  }
  
  getSolution(puzzleString, placeholders) {
    // placeholders == this.getPlaceholdersWithValues(puzzleString)
    if (placeholders.length == 0) {
      return {
        solution: puzzleString // placeholders resolved
      };
    }
    if (placeholders[0].values.length == 0) {
      return {
        error: 'Puzzle cannot be solved' // no values to try
      };
    }
    if (this.checkPlacement(
          puzzleString, placeholders[0].row, placeholders[0].column,
          placeholders[0].values[0])) {
      const result = this.getSolution(
         puzzleString.replace('.', placeholders[0].values.shift()),
         placeholders.slice(1));
      if (result.hasOwnProperty('solution')) {
        return result; // solution found
      }
    }
    return this.getSolution(puzzleString, placeholders); // try next value
  }

  solve(puzzleString) {
    const result = this.validate(puzzleString);
    if (result.valid == false) {
      return {
        error: result.error
      };
    } 
    for (let r = 1; r <= 9; r++) {
      for (let c = 1; c <= 9; c++) {
        const value = puzzleString.charAt((r - 1) * 9 + (c - 1));
        if (value != '.' && this.checkPlacement(puzzleString, r, c, value) == false) {
          return {
            error: 'Puzzle cannot be solved' // invalid puzzleString
          };
        }
      }
    }
    const placeholders = this.getPlaceholdersWithValues(puzzleString);
    return this.getSolution(puzzleString, placeholders);
  }

}

module.exports = SudokuSolver;

