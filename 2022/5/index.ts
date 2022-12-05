import path from "path";
import * as fs from "fs";

const [_stacks, procedure] = fs
  .readFileSync(path.resolve(__dirname, "input.txt"), "utf-8")
  .split("\n\n");

const rows = _stacks.split("\n");
if (rows === undefined) throw new Error();

const stackNumberIndex = rows.pop();
const stackCount = parseInt(stackNumberIndex?.slice(-1) as string);
const rowCount = rows.length;

const buildStack = (stackNumber: number) => {
  return [...Array(rowCount).keys()]
    .map((i) => {
      const charIndex = stackNumberIndex?.indexOf(stackNumber.toString());
      if (charIndex === undefined) throw new Error();

      return rows[i].charAt(charIndex).trim();
    })
    .filter(Boolean);
};

const stacks = [...Array(stackCount).keys()].map((i) => buildStack(i + 1));

const moves = procedure
  .split("\n")
  .map((move) =>
    (move.match(/\d+/g) as string[]).map((move) => parseInt(move))
  );

moves.forEach(([count, fromStackNumber, toStackNumber]) => {
  stacks[toStackNumber - 1].unshift(
    ...stacks[fromStackNumber - 1].splice(0, count).reverse()
  );
});

console.log(stacks.map((stack) => stack[0]).join(""));
