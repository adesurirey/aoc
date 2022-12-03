import path from "path";
import * as fs from "fs";

const input = fs
  .readFileSync(path.resolve(__dirname, "input.txt"), "utf-8")
  .split("\n");

const priorityIndex = [
  "",
  ...new Array(26).fill(1).map((_, i) => String.fromCharCode(97 + i)),
  ...new Array(26).fill(1).map((_, i) => String.fromCharCode(65 + i)),
];

const getIntersectionsPriorityScore = ([
  firstRucksack,
  ...others
]: Set<string>[]) =>
  [...firstRucksack]
    .filter((item) => others.every((rucksack) => rucksack.has(item)))
    .reduce(
      (acc, intersection) => acc + priorityIndex.indexOf(intersection),
      0
    );

console.log(
  input.reduce(
    (acc, rucksack) =>
      acc +
      getIntersectionsPriorityScore([
        new Set(rucksack.slice(0, rucksack.length / 2)),
        new Set(rucksack.slice(rucksack.length / 2)),
      ]),
    0
  )
);

console.log(
  [...Array(Math.ceil(input.length / 3))]
    .map((_) => input.splice(0, 3))
    .reduce(
      (acc, group) =>
        acc +
        getIntersectionsPriorityScore(
          group.map((rucksack) => new Set(rucksack))
        ),
      0
    )
);
