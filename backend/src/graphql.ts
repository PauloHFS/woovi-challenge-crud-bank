import { mergeSchemas } from "@graphql-tools/schema";
import { DefaultContext, DefaultState, ParameterizedContext } from "koa";
import { AuthSchema } from "./auth/graphql";
import { getUserByJWTToken } from "./auth/utils";
import { CoreSchema } from "./core/graphql";

export const schema = mergeSchemas({
  schemas: [AuthSchema, CoreSchema],
});

export async function contextFactory(
  ctx: ParameterizedContext<DefaultState, DefaultContext, any>,
) {
  return {
    user: await getUserByJWTToken(ctx.req),
  };
}
