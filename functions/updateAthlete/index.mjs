import { sendResponse } from "../../responses/index.mjs";
import { athletes } from "../../data/index.mjs";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";

const updateAthlete = async (event) => {
  const { id } = event.pathParameters;
  const { name, sport, age } = event.body ?? {};

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof sport !== "string" ||
    !sport.trim() ||
    typeof age !== "number" ||
    age <= 0
  ) {
    throw createError(
      400,
      "Bad request: name (string), sport (string) and age (number higher that zero) are required in body",
    );
  }

  const index = athletes.findIndex((a) => a.id === id);

  if (index === -1) {
    throw createError(404, "Athlete not found");
  }

  const updatedAthlete = {
    id,
    name: name.trim(),
    sport: sport.trim(),
    age,
  };

  athletes[index] = updatedAthlete;

  return sendResponse(200, {
    message: "Athlete updated successfully",
    athlete: updatedAthlete,
    athletes
  });
};

export const handler = middy(updateAthlete)
  .use(jsonBodyParser())
  .use(httpErrorHandler());
  