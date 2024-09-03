// define logging hierarchy
export const LogLevels = {
  DEBUG: 3,
  INFO: 2,
  WARN: 1,
  ERROR: 0,
} as const;

export type LogLevel = keyof typeof LogLevels;

export class ConsoleLogger {
  logLevel: LogLevel;

  constructor(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  debug(...data: any[]) {
    if (LogLevels["DEBUG"] >= LogLevels[this.logLevel]) {
      console.debug(setColor(COLORS.Cyan), ...data, resetControl);
    }
  }

  info(...data: any[]) {
    if (LogLevels["INFO"] >= LogLevels[this.logLevel]) {
      console.error(setColor(COLORS.Blue), ...data, resetControl);
    }
  }

  warn(...data: any[]) {
    if (LogLevels["WARN"] >= LogLevels[this.logLevel]) {
      console.warn(setColor(COLORS.Yellow), ...data, resetControl);
    }
  }

  error(...data: any[]) {
    if (LogLevels["ERROR"] >= LogLevels[this.logLevel]) {
      console.error(setColor(COLORS.Red), ...data, resetControl);
    }
  }
}

const COLORS = {
  Black: 30,
  Red: 31,
  Green: 32,
  Yellow: 33,
  Blue: 34,
  Magenta: 35,
  Cyan: 36,
  White: 37,
  BgBlack: 40,
  BgRed: 41,
  BgGreen: 42,
  BgYellow: 43,
  BgBlue: 44,
  BgMagenta: 45,
  BgCyan: 46,
  BgWhite: 47,
} as const;

type ColorCode = (typeof COLORS)[keyof typeof COLORS];

const resetControl = "\x1b[0m";

const setColor = (color: ColorCode) => `\x1b[${color}m`;
