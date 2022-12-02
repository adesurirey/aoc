import path from "path";
import * as fs from "fs";

enum Play {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

enum Result {
  Lost = 0,
  Draw = 3,
  Won = 6,
}

const rules = [
  [Play.Scissors, Play.Rock],
  [Play.Paper, Play.Scissors],
  [Play.Rock, Play.Paper],
];

const grid = fs
  .readFileSync(path.resolve(__dirname, "input.txt"), "utf-8")
  .split("\n")
  .map((round) => round.split(" ")) as [
  ("A" | "B" | "C")[],
  ("X" | "Y" | "Z")[]
];

const getTotalScore = (rounds: Play[][]) =>
  rounds.reduce((acc, [opponent, me]) => {
    let result = me;
    if (opponent === me) {
      result += Result.Draw;
    } else {
      const rule = rules.find(
        (rule) => rule.includes(opponent) && rule.includes(me)
      );
      result += rule?.indexOf(me) === 0 ? Result.Lost : Result.Won;
    }
    return acc + result;
  }, 0);

const code1 = {
  A: Play.Rock,
  B: Play.Paper,
  C: Play.Scissors,
  X: Play.Rock,
  Y: Play.Paper,
  Z: Play.Scissors,
};

const rounds1 = grid.map(
  ([opponent, me]) => [code1[opponent], code1[me]] as [Play, Play]
);

console.log(getTotalScore(rounds1));

const code2 = {
  X: Result.Lost,
  Y: Result.Draw,
  Z: Result.Won,
};

const rounds2 = grid.map(([opponent, me]) => {
  const opponentPlay = code1[opponent];
  const possibleRules = rules.filter((rule) =>
    rule.includes(opponentPlay)
  ) as Play[][];

  let myPlay: Play;
  const directive = code2[me as keyof typeof code2];
  if (directive === Result.Draw) {
    myPlay = opponentPlay;
  } else if (directive === Result.Lost) {
    myPlay = possibleRules.find(
      (rule) => rule[1] === opponentPlay
    )?.[0] as Play;
  } else {
    myPlay = possibleRules.find(
      (rule) => rule[0] === opponentPlay
    )?.[1] as Play;
  }
  return [opponentPlay, myPlay];
});

console.log(getTotalScore(rounds2));
