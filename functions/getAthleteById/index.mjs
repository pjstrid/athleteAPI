import { sendResponse } from "../../responses/index.mjs";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";
import { getAthleteById } from "../../services/athletes.mjs";

export const handler = middy(async (event) => {
  const { id } = event.pathParameters;

  const athlete = await getAthleteById(id);

  if (!athlete) {
    throw createError(404, "Athlete not found");
  }

  return sendResponse(200, { athlete });
}).use(httpErrorHandler());

// ----- Gammal kod: in-memory-array från data/index.mjs -----

// import { sendResponse } from "../../responses/index.mjs";
// import { athletes } from "../../data/index.mjs";
// import middy from "@middy/core";
// import httpErrorHandler from "@middy/http-error-handler";
// import { createError } from "@middy/util";
//
// const getAthleteById = async (event) => {
//   const { id } = event.pathParameters;
//
//   const athlete = athletes.find((a) => a.id === id);
//
//   if (!athlete) {
//     throw createError(404, "Athlete not found");
//   }
//
//   return sendResponse(200, { athlete });
// };
//
// export const handler = middy(getAthleteById)
//   .use(httpErrorHandler());
