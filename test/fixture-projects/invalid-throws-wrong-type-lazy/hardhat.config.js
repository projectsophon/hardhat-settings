// We load the plugin here.

require("../../../");

const config = {
  solidity: "0.8.10",
  settings: {
    FooBar: {
      lazy: "Wrong",
    },
  },
};

module.exports = config;
