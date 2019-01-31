import { TENSORFLOW_MODEL_URL } from './constants'

require("dotenv").load();

require("./neural-network/tensorflow")
  .loadModel(TENSORFLOW_MODEL_URL)
  .then(() => require("./bot"));
