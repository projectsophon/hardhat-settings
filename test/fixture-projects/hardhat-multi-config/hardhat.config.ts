// We load the plugin here.
import type { HardhatUserConfig } from "hardhat/types";

import "../../../";

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  settings: {
    HardhatOverrides_0: {
      path: "config_0.json",
      decode(idx) {
        return idx;
      },
      lazy: !!0,
    },
    HardhatOverrides_1: {
      path: "config_1.json",
      decode(idx) {
        return idx;
      },
      lazy: !!1,
    },
  },
};

export default config;
