import { ConsoleColor } from '../constants';
import { ColorObject } from '../types';

export class ColorUtils {
  static STYLE_BOLD = 1;
  static STYLE_DIM = 2;
  static STYLE_ITALIC = 3;
  static STYLE_UNDERLINE = 4;
  static STYLE_BLINK = 5;
  static STYLE_INVERSE = 7;

  static colorize(text: string, { foreground, background }: ColorObject) {
    if (foreground === undefined) return text;

    return `\x1b[${foreground}${
      background ? `;${background}` : ''
    }m${text}\x1b[${ConsoleColor.RESET}m`;
  }

  static getPrefix({ foreground, background }: ColorObject) {
    return `\x1b[${foreground}${background ? `;${background}` : ''}m`;
  }

  static decorate(text: string, style: Number) {
    return `\x1b[${style}m${text}\x1b[${ConsoleColor.RESET}m`;
  }
}
