import { QUERY_ERROR_PREFIX, UNKNOWN_ERROR_MESSAGE } from "./graphql-explorer.constants";

interface GraphQLErrorMessageProps {
  error: unknown;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return UNKNOWN_ERROR_MESSAGE;
};

export const GraphQLErrorMessage = ({ error }: GraphQLErrorMessageProps) => {
  return (
    <p className="text-sm text-destructive">
      {QUERY_ERROR_PREFIX} {getErrorMessage(error)}
    </p>
  );
};
