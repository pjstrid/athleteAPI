import { sendResponse } from "../../responses/index.mjs";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";
import { deleteAthlete } from "../../services/athletes.mjs";

export const handler = middy(async (event) => {
  const { id } = event.pathParameters;

  const athlete = await deleteAthlete(id);

  if (!athlete) {
    throw createError(404, "Athlete not found");
  }

  return sendResponse(200, { message: "Athlete deleted successfully", athlete });
}).use(httpErrorHandler());

// ----- Gammal kod: in-memory-array från data/index.mjs -----

// import { sendResponse } from "../../responses/index.mjs";
// import { athletes } from "../../data/index.mjs";
// import middy from "@middy/core";
// import httpErrorHandler from "@middy/http-error-handler";
// import { createError } from "@middy/util";
//
// const deleteAthlete = async (event) => {
//   const { id } = event.pathParameters;
//
//   const index = athletes.findIndex((a) => a.id === id);
//
//   if (index === -1) {
//     throw createError(404, "Athlete not found");
//   }
//
//   const [deletedAthlete] = athletes.splice(index, 1);
//
//   return sendResponse(200, {
//     message: "Athlete deleted successfully",
//     athlete: deletedAthlete,
//     athletes
//   });
// };
//
// export const handler = middy(deleteAthlete)
//   .use(httpErrorHandler());
