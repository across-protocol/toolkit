// define logging hierarchy
export const LogLevels = {
  DEBUG: 3,
  INFO: 2,
  WARN: 1,
  ERROR: 0,
} as const;

export type LogLevel = keyof typeof LogLevels;

export class DefaultLogger implements LoggerT {
  logLevel: LogLevel;
  readonly secondaryLabel = "@across-protocol/app-sdk";
  readonly logPrefix = ">";

  constructor(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  createLogLevelLabel = (logLevel: LogLevel) => {
    const label = `${setColor(colorMap[logLevel].primary)} ${logLevel} ${resetControl}${setColor(colorMap[logLevel].secondary)} ${this.secondaryLabel}${resetControl}`;
    const prefix = `${setColor(colorMap[logLevel].secondary)}${this.logPrefix}${resetControl}`;

    return {
      label,
      prefix,
    };
  };

  /**
   * Description - creates an indentation group for each call to `logger.[logLevel]()`
   */
  log(logLevel: LogLevel, ...data: unknown[]) {
    const { label, prefix } = this.createLogLevelLabel(logLevel);
    console.log(`${label}\n`);

    data.forEach((item) => {
      console.log(prefix, item, "\n");
    });
  }

  debug(...data: unknown[]) {
    // TODO it might be useful to show the file/function logging this data
    if (LogLevels["DEBUG"] <= LogLevels[this.logLevel]) {
      this.log("DEBUG", ...data);
    }
  }

  info(...data: unknown[]) {
    if (LogLevels["INFO"] <= LogLevels[this.logLevel]) {
      this.log("INFO", ...data);
    }
  }

  warn(...data: unknown[]) {
    if (LogLevels["WARN"] <= LogLevels[this.logLevel]) {
      this.log("WARN", ...data);
    }
  }

  error(...data: unknown[]) {
    if (LogLevels["ERROR"] <= LogLevels[this.logLevel]) {
      this.log("ERROR", ...data);
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

// define colors for log levels here
const colorMap = {
  DEBUG: {
    primary: COLORS.BgBlue,
    secondary: COLORS.Blue,
  },
  INFO: {
    primary: COLORS.BgCyan,
    secondary: COLORS.Cyan,
  },
  WARN: {
    primary: COLORS.BgYellow,
    secondary: COLORS.Yellow,
  },
  ERROR: {
    primary: COLORS.BgRed,
    secondary: COLORS.Red,
  },
} as const;

type LoggerArgs = Parameters<typeof console.log>;

export type LoggerT = {
  debug(...args: LoggerArgs): void;
  info(...args: LoggerArgs): void;
  warn(...args: LoggerArgs): void;
  error(...args: LoggerArgs): void;
};
