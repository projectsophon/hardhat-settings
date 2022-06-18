import { assert } from "chai";
import { task } from "hardhat/config";

task("e2e", "test reading settings", async (_, hre) => {
  const person = hre.settings.person;
  assert.equal(person?.firstName, "blaine");
  assert.equal(person?.lastName, "bublitz");
});
