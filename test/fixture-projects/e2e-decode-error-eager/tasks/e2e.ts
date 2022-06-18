import { assert } from "chai";
import { task } from "hardhat/config";

task("e2e", "test reading settings", async (_, hre) => {
  assert.equal(hre.settings.foobar, "baz");
});
