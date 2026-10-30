import { sendResponse } from "../../responses/index.mjs";
import { athletes } from "../../data/index.mjs";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";

const ALLOWED_FIELDS = ["name", "sport", "age"];

const editAthlete = async (event) => {
  const { id } = event.pathParameters;
  const body = event.body ?? {};

  const fields = Object.keys(body);

  if (fields.length === 0) {
    throw createError(400, "Bad request: body must contain at least one of name, sport or age");
  }

  const invalidFields = fields.filter((f) => !ALLOWED_FIELDS.includes(f));
  if (invalidFields.length > 0) {
    throw createError(400, `Bad request: invalid field(s): ${invalidFields.join(", ")}`);
  }

  if ("name" in body && (typeof body.name !== "string" || !body.name.trim())) {
    throw createError(400, "Bad request: name must be a non-empty string");
  }

  if ("sport" in body && (typeof body.sport !== "string" || !body.sport.trim())) {
    throw createError(400, "Bad request: sport must be a non-empty string");
  }

  if ("age" in body && (typeof body.age !== "number" || body.age <= 0)) {
    throw createError(400, "Bad request: age must be a positive integer");
  }

  const index = athletes.findIndex((a) => a.id === id);

  if (index === -1) {
    throw createError(404, "Athlete not found");
  }

  const editedAthlete = {
    ...athletes[index],
    ...("name" in body && { name: body.name.trim() }),
    ...("sport" in body && { sport: body.sport.trim() }),
    ...("age" in body && { age: body.age }),
  };

  athletes[index] = editedAthlete;

  return sendResponse(200, {
    message: "Athlete edited successfully",
    athlete: editedAthlete,
    athletes
  });
};

export const handler = middy(editAthlete)
  .use(jsonBodyParser())
  .use(httpErrorHandler());