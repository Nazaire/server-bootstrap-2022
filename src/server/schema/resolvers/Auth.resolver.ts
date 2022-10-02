import { Query, Resolver } from "type-graphql";

@Resolver()
export class AuthResolver {
  @Query(() => Number)
  async nonce(): Promise<number> {
    return 123;
    // return (await getOrCreateNonce({ manager: AppDataSource.manager })).value;
  }
}
