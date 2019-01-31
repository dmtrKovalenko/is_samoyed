import fs from "fs-extra";
import path from "path";
import brain from "brain.js";

const savedProgress = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "..", "progress.json"), "utf-8")
);

export const neuralNetwork = new brain.NeuralNetwork();
neuralNetwork.fromJSON(savedProgress);

export function recognize(data: number[]) {
  return neuralNetwork.run(data)
}