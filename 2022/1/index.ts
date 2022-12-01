import path from "path";
import * as fs from "fs";

const totalCaloriesPerElf = fs
  .readFileSync(path.resolve(__dirname, "input.txt"), "utf-8")
  .split("\n\n")
  .map((elf) => elf.split("\n").reduce((a, b) => a + parseInt(b), 0));

console.log(Math.max(...totalCaloriesPerElf));

console.log(
  totalCaloriesPerElf
    .sort((a, b) => a - b)
    .slice(-3)
    .reduce((a, b) => a + b, 0)
);
