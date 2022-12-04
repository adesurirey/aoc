import path from "path";
import * as fs from "fs";

const range = (size: number, startAt: number = 0): number[] =>
  [...Array(size).keys()].map((i) => i + startAt);

const input = fs
  .readFileSync(path.resolve(__dirname, "input.txt"), "utf-8")
  .split("\n")
  .map((pair) =>
    pair.split(",").map((elf) => {
      const [min, max] = elf.split("-").map((boundary) => parseInt(boundary));
      const rangeSize = max - min + 1;
      return range(rangeSize, min);
    })
  );

console.log(
  input.reduce(
    (acc, [a, b]) =>
      a.every((number) => b.includes(number)) ||
      b.every((number) => a.includes(number))
        ? acc + 1
        : acc,
    0
  )
);

console.log(
  input.reduce(
    (acc, [a, b]) => (a.some((number) => b.includes(number)) ? acc + 1 : acc),
    0
  )
);
