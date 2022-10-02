import fs from "fs";
import { toInteger } from "lodash";
import path from "path";
import { parse as parsePostgresUri } from "pg-connection-string";
import { DataSource, DataSourceOptions } from "typeorm";

import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export function setupTypeorm() {
  const AppDataSource = new DataSource({
    name: "default",

    synchronize: false,
    logging: process.env.DEBUG_TYPEORM !== undefined,
    entities: [path.join(__dirname, "../entities/**/*.entity.ts")],
    // migrations: ["migration/**/*.ts"],
    namingStrategy: new SnakeNamingStrategy(),

    // database
    ...dataSourceOptions(),

    // TODO: Replication configuration
    // replication: {
    //   master: {
    //     url: process.env.POSTGRES_URI,
    //   },
    //   slaves: process.env.POSTGRES_RO_URI
    //     ? [
    //         {
    //           url: process.env.POSTGRES_URI,
    //         },
    //       ]
    //     : [],
    // },
  });

  return { AppDataSource };
}

function dataSourceOptions(): DataSourceOptions {
  if (!process.env.POSTGRES_URI) throw "POSTGRES_URI not defined";

  const postgres = parsePostgresUri(process.env.POSTGRES_URI);

  const typeormDatabaseConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: postgres.host!,
    username: postgres.user,
    password: postgres.password,
    port: toInteger(postgres.port),
    database: postgres.database!,
  };

  switch (process.env.NODE_ENV) {
    default:
    case "development":
      return {
        ...typeormDatabaseConfig,
        ssl: false,
      };
    case "staging":
    case "production":
      return {
        ...typeormDatabaseConfig,
        ssl: {
          ca: fs
            .readFileSync(process.env.POSTGRES_CA_CERT as string)
            .toString(),
        },
      };
  }
}
