import path from "path";
import * as fs from "fs";

const TOTAL_SPACE = 70_000_000;
const NEEDED_SPACE = 30_000_000;

type Directory = {
  dirname: string;
  content: (string | Directory)[];
};
type Filesystem = Directory[];

const input = fs
  .readFileSync(path.resolve(__dirname, "input.txt"), "utf-8")
  .split("\n");

const history: Directory[] = [];
const filesystem: Filesystem = [];

const getCurrentDirectory = (): Directory | undefined =>
  history[history.length - 1];

const addContent = (content: string | Directory) => {
  getCurrentDirectory()?.content.push(content);
};

const addDirectory = (dirname: string) => {
  const directory = { dirname, content: [] };

  if (history.length === 0) {
    filesystem.push(directory);
  } else {
    addContent(directory);
  }
};

const cd = (dirname: string) => {
  const current = getCurrentDirectory();
  if (!current) {
    history.push(filesystem[0]);
  } else {
    const directory = current.content
      .filter((content): content is Directory => typeof content === "object")
      .find((content) => content.dirname === dirname);
    if (!directory) throw new Error(`Directory not found: ${dirname}`);

    history.push(directory);
  }
};

input.forEach((line, index) => {
  if (line === "$ ls") {
    return;
  }
  if (index === 0) {
    addDirectory("/");
  }

  if (line.match(/\$ cd ([a-z]+|\/)/)) {
    cd(line.substring(5));
  } else if (line.match(/^dir /)) {
    addDirectory(line.substring(4));
  } else if (line.match(/^\d+/)) {
    addContent(line);
  } else if (line.match(/\$ cd \.\./)) {
    history.pop();
  }
});

const directorySizes: number[] = [];
const getDirectorySize = (directory: Directory) => {
  const size = directory.content.reduce((acc, content) => {
    if (typeof content === "object") {
      return acc + getDirectorySize(content);
    }
    const fileSize = content.match(/^(\d+)/)?.[1];
    if (!fileSize) throw new Error(`File size not found: ${content}`);

    return acc + parseInt(fileSize);
  }, 0);
  directorySizes.push(size);
  return size;
};

const rootDirectorySize = getDirectorySize(filesystem[0]);
const unusedSpace = TOTAL_SPACE - rootDirectorySize;
const neededSpace = NEEDED_SPACE - unusedSpace;

console.log(
  Math.min(...directorySizes.filter((value) => value >= neededSpace))
);
