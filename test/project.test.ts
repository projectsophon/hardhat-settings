import * as path from "path";
import { assert } from "chai";
import { resetHardhatContext } from "hardhat/plugins-testing";

describe("hardhat-settings", function () {
  describe("Test Defaults", function () {
    let hre: any;

    beforeEach("Loading hardhat environment", function () {
      process.chdir(path.join(__dirname, "fixture-projects", "hardhat-defaults"));

      hre = require("hardhat");
    });

    afterEach("Resetting hardhat", function () {
      resetHardhatContext();
    });

    it("adds `settings` to the config", function () {
      assert.isDefined(hre.config.settings);
    });

    it("requires a `name` to be set", function () {
      assert.isString(hre.config.settings[0].name);
      assert.equal(hre.config.settings[0].name, "HardhatDefaults");
    });

    it("defaults undefined config", function () {
      // path stays undefined since defining it triggers a separate code path
      assert.isUndefined(hre.config.settings[0].path);
      // decode
      assert.isFunction(hre.config.settings[0].decode);
      // lazy
      assert.isBoolean(hre.config.settings[0].lazy);
      assert.isTrue(hre.config.settings[0].lazy);
    });
  });

  describe("Test Overrides", function () {
    let hre: any;

    beforeEach("Loading hardhat environment", function () {
      process.chdir(path.join(__dirname, "fixture-projects", "hardhat-overrides"));

      hre = require("hardhat");
    });

    afterEach("Resetting hardhat", function () {
      resetHardhatContext();
    });

    it("adds `settings` to the config", function () {
      assert.isDefined(hre.config.settings);
    });

    it("requires a `name` to be set", function () {
      assert.isString(hre.config.settings[0].name);
      assert.equal(hre.config.settings[0].name, "HardhatOverrides");
    });

    it("overrides other config", function () {
      // path
      assert.isString(hre.config.settings[0].path);
      // decode
      assert.isFunction(hre.config.settings[0].decode);
      // lazy
      assert.isBoolean(hre.config.settings[0].lazy);
      assert.isFalse(hre.config.settings[0].lazy);
    });
  });

  describe("Test multi config", function () {
    let hre: any;

    beforeEach("Loading hardhat environment", function () {
      process.chdir(path.join(__dirname, "fixture-projects", "hardhat-multi-config"));

      hre = require("hardhat");
    });

    afterEach("Resetting hardhat", function () {
      resetHardhatContext();
    });

    it("adds `settings` to the config", function () {
      assert.isDefined(hre.config.settings);
    });

    it("requires a `name` to be set", function () {
      for (const [idx, config] of hre.config.settings.entries()) {
        assert.isString(config.name);
        assert.equal(config.name, `HardhatOverrides_${idx}`);
      }
    });

    it("overrides other config", function () {
      for (const [idx, config] of hre.config.settings.entries()) {
        // path
        assert.equal(config.path, `config_${idx}.json`);
        // decode
        assert.equal(config.decode(idx), idx);
        // lazy
        assert.equal(config.lazy, !!idx);
      }
    });
  });

  describe("Invalid Throws", function () {
    afterEach("Resetting hardhat", function () {
      resetHardhatContext();
    });

    it("throws on empty `key`", function () {
      process.chdir(path.join(__dirname, "fixture-projects", "invalid-throws-empty-name"));

      assert.throws(() => {
        require("hardhat");
      }, /`key` cannot be empty/);
    });

    it("throws on non-string `path`", function () {
      process.chdir(path.join(__dirname, "fixture-projects", "invalid-throws-wrong-type-path"));

      assert.throws(() => {
        require("hardhat");
      }, /`path` config must be a string if provided/);
    });

    it("throws on non-function `decode`", function () {
      process.chdir(path.join(__dirname, "fixture-projects", "invalid-throws-wrong-type-decode"));

      assert.throws(() => {
        require("hardhat");
      }, /`decode` config must be a function if provided/);
    });

    it("throws on non-boolean `lazy`", function () {
      process.chdir(path.join(__dirname, "fixture-projects", "invalid-throws-wrong-type-lazy"));

      assert.throws(() => {
        require("hardhat");
      }, /`lazy` config must be a boolean if provided/);
    });
  });

  describe("e2e", function () {
    const TASK_NAME = "e2e";

    afterEach("Resetting hardhat", async function () {
      resetHardhatContext();
    });

    it("loads toml", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-toml"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("loads toml with network name", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-toml-network"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("surfaces toml parse errors", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-toml-parse-error"));

      const hre = require("hardhat");

      let err;
      try {
        await hre.run(TASK_NAME);
      } catch (e) {
        err = e;
      }
      assert.match(err, /Failed to parse configuration file matching "person"/);
    });

    it("loads json", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-json"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("loads json with network name", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-json-network"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("loads yaml", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-yaml"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("loads yaml with network name", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-yaml-network"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("loads yml", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-yml"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("loads yml with network name", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-yml-network"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("loads js", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-js"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("loads js with network name", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-js-network"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("loads cjs", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-cjs"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("loads cjs with network name", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-cjs-network"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("prefers the network config over non-network config", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-prefer-network-config"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("will load a relative path if given", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-relative-path"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("will load an absolute path if given", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-absolute-path"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("fails with missing config when accessed if lazy", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-missing-config-lazy"));

      const hre = require("hardhat");

      let err;
      try {
        await hre.run(TASK_NAME);
      } catch (e) {
        err = e;
      }
      assert.match(err, /Could not find configuration file matching "person"/);
    });

    it("fails with missing path when accessed if lazy", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-missing-path-lazy"));

      const hre = require("hardhat");

      let err;
      try {
        await hre.run(TASK_NAME);
      } catch (e) {
        err = e;
      }
      assert.match(err, /Failed to load configuration file: \.\/config\/person\.json/);
    });

    it("fails with missing config when loaded if not lazy", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-missing-config-eager"));

      assert.throws(() => {
        require("hardhat");
      }, /Could not find configuration file matching "person"/);
    });

    it("fails with missing config when loaded if not lazy", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-missing-path-eager"));

      assert.throws(() => {
        require("hardhat");
      }, /Failed to load configuration file: \.\/config\/person\.json/);
    });

    it("decodes a non-object lazily", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-decode-non-object"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });

    it("can access in multiple tasks without insane overhead", async function () {
      this.timeout(250);

      process.chdir(path.join(__dirname, "fixture-projects", "e2e-decode-non-object"));

      const hre = require("hardhat");

      let x = 10000;
      while (x > 0) {
        await hre.run(TASK_NAME);
        x--;
      }
    });

    it("surfaces decode errors upon access if lazy", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-decode-error-lazy"));

      const hre = require("hardhat");

      let err;
      try {
        await hre.run(TASK_NAME);
      } catch (e) {
        err = e;
      }
      assert.match(err, /Failed to decode configuration for "foobar"/);
    });

    it("surfaces decode errors when loaded if non-lazy", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-decode-error-eager"));

      assert.throws(() => {
        require("hardhat");
      }, /Failed to decode configuration for "foobar"/);
    });

    it("works seamlessly with `decoders` library", async function () {
      process.chdir(path.join(__dirname, "fixture-projects", "e2e-decoders"));

      const hre = require("hardhat");

      await hre.run(TASK_NAME);
    });
  });
});
