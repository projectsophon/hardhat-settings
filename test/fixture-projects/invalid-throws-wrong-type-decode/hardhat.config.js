// We load the plugin here.

require("../../../");

const config = {
  solidity: "0.8.10",
  settings: {
    FooBar: {
      decode: "Wrong",
    },
  },
};

module.exports = config;
