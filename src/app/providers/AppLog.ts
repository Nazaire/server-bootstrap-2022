import winston from "winston";

// https://github.com/winstonjs/winston

export const AppLog = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  defaultMeta: {},
  transports: [],
});

if (process.env.NODE_ENV !== "production") {
  AppLog.add(
    new winston.transports.Console({
      format: winston.format.prettyPrint(),
    })
  );
} else {
  AppLog.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
