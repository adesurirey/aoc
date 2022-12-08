import path from "path";
import * as fs from "fs";

const lines = fs
  .readFileSync(path.resolve(__dirname, "input.txt"), "utf-8")
  .split("\n")
  .map((line) => line.split("").map((number) => parseInt(number)));

const cols = [...Array(lines[0].length).keys()].map((index) =>
  lines.map((line) => line[index])
);

const isVisible = (tree: number, treeIndex: number, treeLine: number[]) =>
  treeIndex === 0 ||
  treeIndex === treeLine.length - 1 ||
  treeLine.slice(0, treeIndex).every((prevNum) => prevNum < tree) ||
  treeLine.slice(treeIndex + 1).every((nextNum) => nextNum < tree);

const horizontalyVisibles = lines.reduce(
  (acc: `${number}:${number}`[], line, lineIndex) => {
    line.forEach((num, colIndex) => {
      if (isVisible(num, colIndex, line)) {
        acc.push(`${lineIndex + 1}:${colIndex + 1}`);
      }
    });
    return acc;
  },
  []
);

const verticalyVisibles = cols.reduce(
  (acc: `${number}:${number}`[], col, colIndex) => {
    col.forEach((num, lineIndex) => {
      if (isVisible(num, lineIndex, col)) {
        acc.push(`${lineIndex + 1}:${colIndex + 1}`);
      }
    });
    return acc;
  },
  []
);

const visibles = new Set([...horizontalyVisibles, ...verticalyVisibles]);

console.log(visibles.size);

const score = (tree: number, treeIndex: number, treeLine: number[]) => {
  let skipLeft = false;
  let skipRight = false;

  const leftScore = treeLine
    .slice(0, treeIndex)
    .reverse()
    .reduce((acc, prevNum) => {
      if (skipLeft) {
        return acc;
      }
      if (prevNum < tree) {
        return acc + 1;
      }
      skipLeft = true;
      return acc + 1;
    }, 0);

  const rightScore = treeLine.slice(treeIndex + 1).reduce((acc, nextNum) => {
    if (skipRight) {
      return acc;
    }
    if (nextNum < tree) {
      return acc + 1;
    }
    skipRight = true;
    return acc + 1;
  }, 0);

  return leftScore * rightScore;
};

const horizontalScores = lines.reduce((acc: number[][], line) => {
  acc.push([]);
  line.forEach((num, index) => {
    acc[acc.length - 1].push(score(num, index, line));
  });
  return acc;
}, []);

const verticalScores = cols.reduce((acc: number[][], col) => {
  acc.push([]);
  col.forEach((num, index) => {
    acc[acc.length - 1].push(score(num, index, col));
  });
  return acc;
}, []);

const scores = horizontalScores.map((scores, lineIndex) => {
  return scores.map((score, colIndex) => {
    return score * verticalScores[colIndex][lineIndex];
  });
});

console.log(Math.max(...scores.flat()));
