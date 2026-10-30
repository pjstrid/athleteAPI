import { sendResponse } from "../../responses/index.mjs";
import { athletes } from "../../data/index.mjs";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";

const getAthleteById = async (event) => {
  const { id } = event.pathParameters;

  const athlete = athletes.find((a) => a.id === id);

  if (!athlete) {
    throw createError(404, "Athlete not found");
  }

  return sendResponse(200, { athlete });
};

export const handler = middy(getAthleteById)
  .use(httpErrorHandler());