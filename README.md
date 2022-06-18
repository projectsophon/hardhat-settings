# hardhat-settings

Hardhat plugin to load, validate, and populate settings in the environment.

## What

Hardhat is primarily a command-line tool, but adding many parameters to your tasks over time
can result in an unwieldly command. Big contracts might even need a lot of initialization options, e.g. dark forest v0.5 [needs ~40](https://github.com/darkforest-eth/eth/blob/30584297044a44d20c672614e2a8f5917086e5ab/darkforest.toml). These would be impossible to pass as command-line arguments.

This plugin provides a convenient way to specify various configuration that you want to be available to your hardhat runtime environment. It will load files with a variety of file extensions (`.toml`, `.json`, `.yaml`, `.yml`, `.js`, `.cjs`) and even choose based on the active network. For example, you could have a `my_settings.hardhat.toml`, `my_settings.localhost.toml`, and `my_settings.xdai.toml` file, and the one that matches the current network will be loaded.

If you are using TypeScript, you can opt-in to additional type safety and autocompletion with some very concise code. See the [TypeScript support](#typescript-support) section below for more details.

## Installation

```bash
npm install hardhat-settings
```

Import the plugin in your `hardhat.config.js`:

```js
require("hardhat-settings");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "hardhat-settings";
```

## Basic configuration

Set up your project (we'll use `best_dapp_ever/`) with the following minimal `hardhat.config.js` at the root. The only `settings` configuration maps keys of the object to files you want to load.

```js
module.exports = {
  solidity: "0.8.10",
  settings: {
    best_dapp_ever: {},
  },
};
```

Your project structure should look like this:

```
j:~/best_dapp_ever/ $ tree
├── hardhat.config.js
└── best_dapp_ever.toml
```

Now, when you use any hardhat command, the plugin will find `best_dapp_ever.toml` in the root and make it available in your hardhat runtime environment.

## Advanced configuration

If you'd like to further control over how your settings are processed, the plugin exposes a few options:

```js
module.exports = {
  solidity: "0.8.10",
  settings: {
    // (required) The key maps to your config name
    best_dapp_ever: {
      // (optional) A function that is called with the input from your config file
      // and returns the value to be used as the value for your settings.
      // Generally, you'll want to do validation in this function (see `Using decoders` below)
      decode: function (input) {
        return 12345;
      },
      // (optional) Whether the config is loaded lazily. If `true`, the config file won't
      // be searched or loaded until the first variable access. Defaults to `true`.
      lazy: true,
      // (optional) An exact path to load, skips all file searching logic.
      // Useful if you know an exact file that you need to load, but still want the parsing
      // and decoding logic from this plugin.
      path: "./foo/bar/baz.json",
    },
  },
};
```

## TypeScript support

Additonal TypeScript support can be achieved through declaration merging. We provide a
`HardhatSettings` interface on the `"hardhat/types"` module. By extending this interface
and specifying your settings types, we can propagate those throughout your tasks.

This is as simple as a module declaration in your `hardhat.config.ts`:

```ts
import type { HardhatUserConfig } from "hardhat/types";
import "hardhat-settings";

declare module "hardhat/types" {
  interface HardhatSettings {
    person: {
      firstName: string;
      lastName: string;
    };
  }
}

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  settings: {
    person: {},
  },
};

export default config;
```

## Using decoders

The `decoders` library integrates seamlessly with this plugin. By defining decoders, you
get parsing, validation, conversion, and type safety for free.

For example, you could re-implement the TypeScript example above like this:

```ts
import type { HardhatUserConfig } from "hardhat/types";
import "hardhat-settings";
import { object, string, DecoderType } from "decoders";

const person = object({
  firstName: string,
  lastName: string,
});

declare module "hardhat/types" {
  interface HardhatSettings {
    person: DecoderType<typeof person>;
  }
}

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  settings: {
    person: {
      decode: person.verify,
    },
  },
};

export default config;
```
