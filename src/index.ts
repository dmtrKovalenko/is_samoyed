require("dotenv").load();

require("./neural-network/tensorflow")
  .loadModel()
  .then(() => require("./bot"));
