import path from "path";
import * as fs from "fs";

const input = fs
  .readFileSync(path.resolve(__dirname, "input.txt"), "utf-8")
  .split("");

const getMarkerPosition = (markerLength: number) => {
  for (let i = 0; i < input.length; i++) {
    if (new Set(input.slice(i, i + markerLength)).size === markerLength) {
      return i + markerLength;
    }
  }
};

console.log(getMarkerPosition(4));
console.log(getMarkerPosition(14));
