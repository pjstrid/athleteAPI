import { sendResponse } from "../../responses/index.mjs";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";
import { updateAthlete } from "../../services/athletes.mjs";

export const handler = middy(async (event) => {
  const { id } = event.pathParameters;
  const { name, sport, autograph } = event.body ?? {};

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof sport !== "string" ||
    !sport.trim() ||
    typeof autograph !== "boolean"
  ) {
    throw createError(
      400,
      "Bad request: name (string), sport (string) and autograph (boolean) are required in body",
    );
  }

  const athlete = await updateAthlete(id, {
    name: name.trim(),
    sport: sport.trim(),
    autograph,
  });

  return sendResponse(200, { message: "Athlete updated successfully", athlete });
}).use(jsonBodyParser())
  .use(httpErrorHandler());

// ----- Gammal kod: in-memory-array från data/index.mjs -----

// import { sendResponse } from "../../responses/index.mjs";
// import { athletes } from "../../data/index.mjs";
// import middy from "@middy/core";
// import jsonBodyParser from "@middy/http-json-body-parser";
// import httpErrorHandler from "@middy/http-error-handler";
// import { createError } from "@middy/util";
//
// const updateAthlete = async (event) => {
//   const { id } = event.pathParameters;
//   const { name, sport, age } = event.body ?? {};
//
//   if (
//     typeof name !== "string" ||
//     !name.trim() ||
//     typeof sport !== "string" ||
//     !sport.trim() ||
//     typeof age !== "number" ||
//     age <= 0
//   ) {
//     throw createError(
//       400,
//       "Bad request: name (string), sport (string) and age (number higher that zero) are required in body",
//     );
//   }
//
//   const index = athletes.findIndex((a) => a.id === id);
//
//   if (index === -1) {
//     throw createError(404, "Athlete not found");
//   }
//
//   const updatedAthlete = {
//     id,
//     name: name.trim(),
//     sport: sport.trim(),
//     age,
//   };
//
//   athletes[index] = updatedAthlete;
//
//   return sendResponse(200, {
//     message: "Athlete updated successfully",
//     athlete: updatedAthlete,
//     athletes
//   });
// };
//
// export const handler = middy(updateAthlete)
//   .use(jsonBodyParser())
//   .use(httpErrorHandler());
//   
