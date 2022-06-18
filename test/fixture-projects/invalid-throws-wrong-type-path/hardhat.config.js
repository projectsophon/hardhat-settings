// We load the plugin here.

require("../../../");

const config = {
  solidity: "0.8.10",
  settings: {
    FooBar: {
      path: ["Wrong"],
    },
  },
};

module.exports = config;
