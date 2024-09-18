export class ConsoleColor {
  static TEXT_BLACK = 30;
  static TEXT_GRAY = 90;
  static TEXT_RED = 31;
  static TEXT_GREEN = 32;
  static TEXT_YELLOW = 33;
  static TEXT_BLUE = 34;
  static TEXT_MAGENTA = 35;
  static TEXT_CYAN = 36;
  static TEXT_WHITE = 37;
  static BACKGROUND_BLACK = 40;
  static BACKGROUND_RED = 41;
  static BACKGROUND_GREEN = 42;
  static BACKGROUND_YELLOW = 43;
  static BACKGROUND_BLUE = 44;
  static BACKGROUND_MAGENTA = 45;
  static BACKGROUND_CYAN = 46;
  static BACKGROUND_WHITE = 47;
  static RESET = 0;
}

export class ColorPaletteTemplate {
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
