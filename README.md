# Lovely Error

Minimal, powerful, and highly customizable error parser and manager for JavaScript! 🚀

> [!WARNING]
> Not stable yet!

# Features

- **Parser:** Parsing error message and stack to meaningful objects.
- **Exception Filter:** This feature inspired by Java to handle different exceptions separately.
- **Logger:** Hmm! Not actually a logger, but it will pass the final neat string to your preferred logger.

# Compatibility

We are going to add more of them soon!

- [x] NodeJS
- [ ] Deno
- [ ] Bun
- [ ] Chrome
- [ ] FireFox
- [ ] IE

# How to Use

## Installation

```console
npm install lovely-error
yarn add lovely-error
pnpm install lovely-error
```

## Constructor

To instantiate `LovelyError` you can pass two parameters. (your error instance [required], options to customize behavior [optional])

```javascript
try {
  throw new Error('Something went wrong!');
} catch (error) {
  const lovelyError = new LovelyError(error, { includePackageTrace: true });
}
```

### Options

- `includePackageTrace`: Include traces that have been ended up in your `node_modules` folder.
- `includeProjectTrace`: Include traces that is related to your project source code.
- `includeNodeTrace`: Include `node:internal` traces.
- `provideSupplementaryTrace`: Some packages limited their errors trace, and as a result we won't have the error trace in our source code! This feature provides a supplementary trace next to the original trace that points where `LovelyError` instantiated to help you debug better!
- `traceLimit`: Will limit traces that would be **parsed (not those that would be provided).**

```typescript
type LovelyStackOptions = {
  includePackageTrace?: boolean; // default: false
  includeProjectTrace?: boolean; // default: true
  includeNodeTrace?: boolean; // default: false
  provideSupplementaryTrace?: boolean; // default: true
  traceLimit?: number; // default: 10
};
```

This package has only three methods that can be accessed by instance or statically.

## `LovelyError.stack`

This function simply return the parsed error.

```javascript
catch (error) {
  // by instance
  const lovelyError = new LovelyError(error, { includePackageTrace: true });
  const stack = lovelyError.stack();

  // by static function
  const stack = LovelyError.stack(error, { includePackageTrace: true });
}
```

The returned stack will have an structure like this:

```typescript
type LovelyTraceElement = {
  method: {
    name: string;
    alias?: string;
    parent?: string;
  };
  filePath: string;
  line: string;
  column: string;
};

type LovelyStack = {
  exception: string;
  message: string;
  trace?: LovelyTraceElement[];
  packageTrace?: LovelyTraceElement[];
  projectTrace?: LovelyTraceElement[];
  nodeTrace?: LovelyTraceElement[];
  stringTrace?: string;
};
```

## `LovelyError.catch`

This function will help you to handle your errors separately by their exception. (inspired by Java)

```typescript
catch (error) {
  // by instance
  const lovelyError = new LovelyError(error);

  lovelyError.catch('IOException', (stack: LovelyStack) => {
    console.log(`I just care about ${stack.exception}`);
    console.log(`message: ${stack.message}`);
  });

  // by static function (not recommended for more than one)
  LovelyError.catch(error, LovelyError.NO_EXCEPTION, (stack: LovelyStack) => {
    console.log('Default error instance! Hmm...');
  });
}
```

## `LovelyError.log`

Log provided stack in a neat way with your preferred logger (default: `console.log`), by this powerful and highly customizable function. Let me show what I mean by highly customizable. This is our base code without any configuration:

```javascript
class ConnectionException extends Error {
  name = ConnectionException.name;

  constructor(message) {
    super(message);
  }
}

const app = express();

app.get('/', function rootHandler(req, res) {
  try {
    throw new ConnectionException('Failed to connect to target server!');
  } catch (error) {
    new LovelyError(error, {
      includeNodeTrace: true,
      includePackageTrace: true,
    }).log();

    res.send();
  }
});

app.listen(3000);
```

Output:
![lovely_log_default_output](https://github.com/user-attachments/assets/ca80e1af-b798-4748-bb0a-462d76ab20e1)
You see there is actually not much difference between this log and simply `console.log(error);`, but the power is you can change this to a completely different thing!

### Options

- `logger`: A logger function.
- `colorize`: Add ANSI color codes to log string (turn it off if you are storing logs).
- `verbose`: Will include full filePath, and if you set it to false you will see a summarized filePath.
- `colorPalette`: Color scheme for each part of the log.

```typescript
type LovelyLogOptions = {
  logger?: LoggerFunction | null; // default: console.log
  colorize?: boolean; // default: true
  verbose?: boolean; // default: true
  colorPalette?: LogColorPalette;
};
```

### Color Palette Object

```typescript
export type ColorObject = { foreground: number; background?: number };

export type LogColorPalette = {
  exception?: ColorObject;
  message?: ColorObject;
  treeArrow?: ColorObject;
  packageTrace?: ColorObject;
  projectTrace?: ColorObject;
  nodeTrace?: ColorObject;
};
```

Default Object:

```javascript
{
  exception: {
      foreground: ConsoleColor.TEXT_BLACK,
      background: ConsoleColor.BACKGROUND_RED,
  },
  message: {
      foreground: ConsoleColor.TEXT_RED,
  },
  treeArrow: {
      foreground: ConsoleColor.TEXT_YELLOW,
  },
  packageTrace: {
      foreground: ConsoleColor.TEXT_GRAY,
  },
  projectTrace: {
      foreground: ConsoleColor.TEXT_WHITE,
  },
  nodeTrace: {
      foreground: ConsoleColor.TEXT_GRAY,
  },
},
```

> [!NOTE]
> When you're filling log options, your missed properties will filled by this default object

### Built-in Color Palette Templates

We provided some regular built-in palette templates to save your time!

Here is our template class that you can use:

```typescript
class ColorPaletteTemplate {
  static ERROR_PALETTE = {
    exception: {
      foreground: ConsoleColor.TEXT_BLACK,
      background: ConsoleColor.BACKGROUND_RED,
    },
    message: {
      foreground: ConsoleColor.TEXT_RED,
    },
    treeArrow: {
      foreground: ConsoleColor.TEXT_RED,
    },
  };
  static WARNING_PALETTE = {
    exception: {
      foreground: ConsoleColor.TEXT_BLACK,
      background: ConsoleColor.BACKGROUND_YELLOW,
    },
    message: {
      foreground: ConsoleColor.TEXT_YELLOW,
    },
    treeArrow: {
      foreground: ConsoleColor.TEXT_YELLOW,
    },
  };
  static INFO_PALETTE = {
    exception: {
      foreground: ConsoleColor.TEXT_BLACK,
      background: ConsoleColor.BACKGROUND_CYAN,
    },
    message: {
      foreground: ConsoleColor.TEXT_CYAN,
    },
    treeArrow: {
      foreground: ConsoleColor.TEXT_CYAN,
    },
  };
  static DEBUG_PALETTE = {
    exception: {
      foreground: ConsoleColor.TEXT_WHITE,
      background: ConsoleColor.BACKGROUND_MAGENTA,
    },
    message: {
      foreground: ConsoleColor.TEXT_MAGENTA,
    },
    treeArrow: {
      foreground: ConsoleColor.TEXT_MAGENTA,
    },
  };
}
```

### Final Example

Let's see another and more customized log to feel the difference:

```javascript
app.get('/', function rootHandler(req, res) {
  try {
    throw new ConnectionException('Failed to connect to target server!');
  } catch (error) {
    const lovelyError = new LovelyError(error, {
      includeNodeTrace: true,
      includePackageTrace: true,
    });

    // using template
    lovelyError.log({
      verbose: false,
      colorPalette: ColorPaletteTemplate.INFO_PALETTE,
    });

    // using custom object
    lovelyError.log({
      verbose: false,
      colorPalette: {
        exception: {
          background: ConsoleColor.BACKGROUND_GREEN,
        },
        message: {
          foreground: ConsoleColor.TEXT_GREEN,
        },
        projectTrace: {
          foreground: ConsoleColor.TEXT_GREEN,
        },
        packageTrace: {
          foreground: ConsoleColor.TEXT_BLUE,
        },
      },
    });

    res.send();
  }
});
```

Output:
![lovely_log_customized_output](https://github.com/user-attachments/assets/a184f8ca-a658-4599-b6aa-8d56f2fa9a7d)

Don't know about you! But I like this more than simple `console.log`

# Contribution

We didn't define any rule, and code of conduct yet, let's see how this package will grow first! <br>
We invite everyone that interested to this project. Just open an issue or fork this repository and make a PR!

# License

```license
MIT License

Copyright (c) 2024 xvyashar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
