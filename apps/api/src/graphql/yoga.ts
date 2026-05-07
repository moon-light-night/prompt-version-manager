import { createYoga, createSchema } from "graphql-yoga";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { createContext } from "@/trpc/context";

export const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response, Request, Headers },
  context: createContext,
  maskedErrors: process.env.NODE_ENV === "production",
  logging: false,
});
