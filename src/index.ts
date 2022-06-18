import * as toml from "@iarna/toml";
import { cosmiconfigSync, defaultLoaders, OptionsSync } from "cosmiconfig";
import { extendConfig, extendEnvironment } from "hardhat/config";
import { HardhatPluginError } from "hardhat/plugins";
import type { HardhatConfig, HardhatUserConfig, HardhatRuntimeEnvironment } from "hardhat/types";

import * as pkg from "../package.json";

export const PLUGIN_NAME = pkg.name;
export const PLUGIN_VERSION = pkg.version;

function identity(input: any): any {
  return input;
}

// Add our types to the Hardhat config
declare module "hardhat/types" {
  // Ref https://stackoverflow.com/a/58261244 for the awesome trick
  /**
   * Settings can be declared (merged) into this interface and their types
   * will be propagated throughout your hardhat environment.
   */
  interface HardhatSettings {
    [key: string]: any;
  }

  interface HardhatUserConfig {
    /**
     * Configuration of any settings files you want to load.
     *
     * Lookup logic will be applied that tries to load (in order):
     * - `${key}.${network}.toml`
     * - `${key}.${network}.json`
     * - `${key}.${network}.yaml`
     * - `${key}.${network}.yml`
     * - `${key}.${network}.js`
     * - `${key}.${network}.cjs`
     * - `${key}.toml`
     * - `${key}.json`
     * - `${key}.yaml`
     * - `${key}.yml`
     * - `${key}.js`
     * - `${key}.cjs`
     */
    settings?: {
      [T in keyof HardhatSettings]: {
        /**
         * A decoder function can be provided to validate or convert the file
         * input into the settings you expect.
         *
         * See the README for documentation on using something like `decoders`.
         *
         * @param input Whatever data was loaded from the file
         * @returns The expected type
         */
        decode?: (input: any) => HardhatSettings[T];
        /**
         * Specifies whether your settings are loaded upon first access or immediately.
         *
         * @defaultValue true
         */
        lazy?: boolean;
        /**
         * Providing a path will not use the searching logic.
         * That exact file will be loaded or an error will be thrown.
         * */
        path?: string;
      };
    };
  }

  // This has less strict types because it is only used to pass data into extendEnvironment
  interface HardhatConfig {
    settings: {
      name: string;
      decode: (input: any) => any;
      lazy: boolean;
      path?: string;
    }[];
  }

  interface HardhatRuntimeEnvironment {
    settings: {
      [T in keyof HardhatSettings]: HardhatSettings[T];
    };
  }
}

extendConfig((config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
  config.settings = [];

  for (const [settingName, { decode, lazy, path }] of Object.entries(userConfig.settings ?? {})) {
    if (settingName === "") {
      throw new HardhatPluginError(PLUGIN_NAME, "`key` cannot be empty.");
    }
    if (decode && typeof decode !== "function") {
      throw new HardhatPluginError(PLUGIN_NAME, "`decode` config must be a function if provided.");
    }
    if (lazy && typeof lazy !== "boolean") {
      throw new HardhatPluginError(PLUGIN_NAME, "`lazy` config must be a boolean if provided.");
    }
    if (path && typeof path !== "string") {
      throw new HardhatPluginError(PLUGIN_NAME, "`path` config must be a string if provided.");
    }

    config.settings.push({
      name: settingName,
      path,
      decode: decode ?? identity,
      lazy: lazy ?? true,
    });
  }
});

extendEnvironment((env: HardhatRuntimeEnvironment) => {
  env.settings = {};

  const network = env.network.name;

  const cache = new Map();

  for (const { name, decode, lazy, path } of env.config.settings) {
    // Stopping at the hardhat root is a conservative choice.
    // Can re-evaluate this if someone wants to crawl up further.
    const exp = explorer(name, network, { stopDir: env.config.paths.root });

    const loader = () => {
      if (cache.has(name)) {
        return cache.get(name);
      }
      let input;
      if (path) {
        input = load(exp, path);
      } else {
        input = search(exp);
      }
      try {
        const output = decode(input);
        cache.set(name, output);
        return output;
      } catch (err) {
        throw new HardhatPluginError(PLUGIN_NAME, `Failed to decode configuration for "${name}"`, err as Error);
      }
    };

    if (lazy) {
      Object.defineProperty(env.settings, name, {
        configurable: false,
        enumerable: true,
        get: loader,
      });
    } else {
      env.settings[name] = loader();
    }
  }
});

/* Cosmiconfig helpers */

function tomlLoader(filename: string, content: string) {
  return toml.parse(content);
}

function explorer(name: string, network: string, options?: OptionsSync) {
  const exp = cosmiconfigSync(name, {
    searchPlaces: [
      `${name}.${network}.toml`,
      `${name}.${network}.json`,
      `${name}.${network}.yaml`,
      `${name}.${network}.yml`,
      `${name}.${network}.js`,
      `${name}.${network}.cjs`,
      `${name}.toml`,
      `${name}.json`,
      `${name}.yaml`,
      `${name}.yml`,
      `${name}.js`,
      `${name}.cjs`,
    ],
    loaders: {
      ...defaultLoaders,
      ".toml": tomlLoader,
    },
    ...options,
  });

  // We attach the name onto the return so we can provide better error messages
  return { ...exp, name };
}

function search(exp: ReturnType<typeof explorer>): any {
  let result;
  try {
    result = exp.search();
  } catch (err) {
    throw new HardhatPluginError(
      PLUGIN_NAME,
      `Failed to parse configuration file matching "${exp.name}"`,
      err as Error
    );
  }
  if (result) {
    return result.config;
  } else {
    throw new HardhatPluginError(PLUGIN_NAME, `Could not find configuration file matching "${exp.name}"`);
  }
}

function load(exp: ReturnType<typeof explorer>, path: string): any {
  let result;
  let err: Error | undefined;
  try {
    result = exp.load(path);
  } catch (e) {
    err = e as Error;
  }
  if (result) {
    return result.config;
  } else {
    throw new HardhatPluginError(PLUGIN_NAME, `Failed to load configuration file: ${path}`, err);
  }
}
