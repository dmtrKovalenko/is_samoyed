import fs from "fs-extra";
import path from "path";
import { imageToPixels } from "../src/utils/image-processor";
import { neuralNetwork } from "../src/neural-network/brain";

const samoyedDir = path.resolve(__dirname, "..", "data", "samoyed");
const notSamoyedDir = path.resolve(__dirname, "..", "data", "not-samoyed");
const progressDir = path.resolve(__dirname, "..", "progress.json");

const data: any = []

async function processDirectory(
  directoryPath: string,
  outPutValue: any,
) {
  const directory = await fs.readdir(directoryPath);

  for (const file of directory) {
    const fileData = await fs.readFile(path.resolve(directoryPath, file));
    const pixels = await imageToPixels(fileData);

    data.push({ input: pixels, output: [outPutValue]})
  }
}

async function train() {
  await processDirectory(samoyedDir, 1)
  await processDirectory(notSamoyedDir, 0)

  data.forEach((item: any) => console.log(item.output[0]))
  neuralNetwork.train(data, { errorThresh: 0.5, log: true })

  const progressJson = neuralNetwork.toJSON();
  await fs.writeFile(progressDir, JSON.stringify(progressJson));
}

train()
  .then(async () => {
    const directory = await fs.readdir(notSamoyedDir);
    const fileData = await fs.readFile(path.resolve(notSamoyedDir, directory[0]));

    const pixels = await imageToPixels(fileData);
    console.log(neuralNetwork.run(pixels))
  })
  .catch(console.log);

