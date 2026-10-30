import { sendResponse } from "../../responses/index.mjs";
import { athletes } from "../../data/index.mjs";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";

const deleteAthlete = async (event) => {
  const { id } = event.pathParameters;

  const index = athletes.findIndex((a) => a.id === id);

  if (index === -1) {
    throw createError(404, "Athlete not found");
  }

  const [deletedAthlete] = athletes.splice(index, 1);

  return sendResponse(200, {
    message: "Athlete deleted successfully",
    athlete: deletedAthlete,
    athletes
  });
};

export const handler = middy(deleteAthlete)
  .use(httpErrorHandler());