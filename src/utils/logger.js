const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

const log = (color, label, ...args) => {
  console.log(`${color}${label}${colors.reset}`, ...args);
};

export default {
  info: (...args) => log(colors.green, "[INFO]", ...args),
  warn: (...args) => log(colors.yellow, "[WARN]", ...args),
  error: (...args) => log(colors.red, "[ERROR]", ...args),
  debug: (...args) => log(colors.blue, "[DEBUG]", ...args),
};
