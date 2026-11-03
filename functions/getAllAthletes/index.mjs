import { sendResponse } from "../../responses/index.mjs";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { getAthletes } from "../../services/athletes.mjs";

export const handler = middy(async (event) => {
  const { sport, search } = event.queryStringParameters ?? {};

  let result = await getAthletes();

  if (sport) {
    result = result.filter(
      (a) => a.sport.toLowerCase() === sport.toLowerCase()
    );
  }

  if (search) {
    result = result.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return sendResponse(200, {
    count: result.length,
    athletes: result,
  });
}).use(httpErrorHandler());

// ----- Gammal kod: in-memory-array från data/index.mjs -----

// import { sendResponse } from "../../responses/index.mjs";
// import { athletes } from "../../data/index.mjs";
// import middy from "@middy/core";
// import httpErrorHandler from "@middy/http-error-handler";
// import { createError } from "@middy/util";
//
// const getAllAthletes = async (event) => {
//   const { sport, search, minAge, maxAge } = event.queryStringParameters ?? {};
//
//   const min = minAge !== undefined ? Number(minAge) : undefined;
//   const max = maxAge !== undefined ? Number(maxAge) : undefined;
//
//   if ((min !== undefined && Number.isNaN(min)) || (max !== undefined && Number.isNaN(max))) {
//     throw createError(400, "Bad request: minAge and maxAge must be numbers");
//   }
//
//   let result = athletes;
//
//   if (sport) {
//     result = result.filter(
//       (a) => a.sport.toLowerCase() === sport.toLowerCase()
//     );
//   }
//
//   if (search) {
//     result = result.filter((a) =>
//       a.name.toLowerCase().includes(search.toLowerCase())
//     );
//   }
//
//   if (min !== undefined) {
//     result = result.filter((a) => a.age >= min);
//   }
//
//   if (max !== undefined) {
//     result = result.filter((a) => a.age <= max);
//   }
//
//   return sendResponse(200, {
//     count: result.length,
//     athletes: result,
//   });
// };
//
// export const handler = middy(getAllAthletes)
//   .use(httpErrorHandler());
