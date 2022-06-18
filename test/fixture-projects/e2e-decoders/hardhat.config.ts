// We load the plugin here.
import type { HardhatUserConfig } from "hardhat/types";

import "../../../";
import { person, Person, bar } from "./decoders";
import "./tasks/e2e";

declare module "hardhat/types" {
  interface HardhatSettings {
    person?: Person;
    bar?: string;
  }
}

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  settings: {
    person: {
      decode: person.verify,
    },
    bar: {
      decode: bar.value,
      lazy: false,
    },
  },
};

export default config;
