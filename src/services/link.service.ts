import * as csv from "csvtojson";
import * as fetch from "node-fetch";
import { linkRequestBody } from "../classes/linkRequest";

export const linkService = async (body: linkRequestBody): Promise<any> => {
  let error = "";

  if (!body.url) {
    throw new Error("url parameter is missing from body");
  }

  let result: any[] = [];
  let buffData = "";

  //Get Response Body
  const response = await fetch.default(body.url);
  // Convert Body to buffer
  buffData += await response.buffer();
  // Remove special characters
  buffData = buffData.replace(/(\r|\t)/gm, ",");
  // Parse to JSON
  await csv
    .default({ trim: true })
    .fromString(buffData)
    .subscribe((data) => {
      //If user and amount headers dont exist return an error
      if (!data.user || !data.amount) {
        error =
          "Invalid File Header/Value (file header and values should be user and amount)";
        return;
      }
      let amount = parseFloat(data.amount);
      // If amount is not a number (float or int), return an error
      if (amount) {
        result.push({ user: data.user, amount });
      } else {
        error = "Invalid Amount (Amount should be an int or float)";
        return;
      }
    });

  if (error) {
    throw new Error(error);
  }
  if (!result.length) {
    throw new Error("File is empty");
  }
  return result;
};
