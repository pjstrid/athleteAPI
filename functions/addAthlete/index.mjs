import { sendResponse } from "../../responses/index.mjs";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";
import jsonBodyParser from "@middy/http-json-body-parser";
import { addAthlete } from "../../services/athletes.mjs";

export const handler = middy(async (event) => {
  const { name, sport } = event.body ?? {};

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof sport !== "string" ||
    !sport.trim()
  ) {
    throw createError(
      400,
      "Bad request: name (string) and sport (string) are required in body",
    );
  }

  const newAthlete = {
    type: "athlete",
    id: crypto.randomUUID().slice(0, 5),
    name: name.trim(),
    sport: sport.trim(),
    autograph: false,
  };

  const athlete = await addAthlete(newAthlete);

  return sendResponse(201, { message: "New athlete added", athlete });
}).use(jsonBodyParser())
  .use(httpErrorHandler());

// ----- Gammal kod: in-memory-array från data/index.mjs -----

// import { sendResponse } from "../../responses/index.mjs";
// import { athletes } from "../../data/index.mjs";
// import middy from "@middy/core";
// import httpErrorHandler from "@middy/http-error-handler";
// import { createError } from "@middy/util";
// import jsonBodyParser from "@middy/http-json-body-parser";
//
// const addAthlete = async (event) => {
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
//   const newAthlete = {
//     id: crypto.randomUUID().slice(0, 5),
//     name: name.trim(),
//     sport: sport.trim(),
//     age,
//   };
//
//   athletes.push(newAthlete);
//
//   return sendResponse(201, {
//     message: "Athlete created successfully",
//     athlete: newAthlete,
//     athletes
//   });
// };
//
// export const handler = middy(addAthlete)
//   .use(jsonBodyParser())
//   .use(httpErrorHandler());

