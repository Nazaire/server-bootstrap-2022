import "reflect-metadata";

import express from "express";
import path from "path";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { bootstrap } from "./bootstrap";
import { graphqlHTTP } from "express-graphql";
import { AuthMiddleware } from "./middleware/Auth.middleware";

async function main() {
  await bootstrap();

  const app = express();

  // todo: define domains here before release
  app.use(cors());

  const graphql = await makeGraphQL();

  app.use("/graphql", AuthMiddleware, graphql);

  app.listen(process.env.PORT || 8080, () => {
    console.log(`Listening on http://localhost:${process.env.PORT || 8080}`);
  });
}

main();

async function makeGraphQL() {
  const schema = await buildSchema({
    // ...options,
    // authChecker: app.authChecker,
    resolvers: [path.join(__dirname, "./schema/resolvers/**/*.resolver.ts")],
    emitSchemaFile: path.join(__dirname, "../exports/schema.graphql"),
  });

  return graphqlHTTP(async (req, res, graphqlParams) => {
    return {
      schema: schema,
      // context:
      //   app.initContext &&
      //   (await app.initContext(req as Request, res as Response, graphqlParams)),
      graphiql:
        process.env.NODE_ENV !== "production"
          ? {
              headerEditorEnabled: true,
              shouldPersistHeaders: true,
            }
          : false,
      // customFormatErrorFn: options?.customFormatErrorFn,
    };
  });
}
