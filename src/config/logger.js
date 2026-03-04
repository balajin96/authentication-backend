const log = (level, message, meta = {}) => {
  const payload = {
    time: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  const serialized = JSON.stringify(payload);

  if (level === "error") {
    console.error(serialized);
    return;
  }

  console.log(serialized);
};

export const logger = {
  info: (message, meta) => log("info", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  error: (message, meta) => log("error", message, meta),
};
