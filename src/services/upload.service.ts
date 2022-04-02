import * as csv from "csvtojson";
import * as fs from "fs/promises";
import { uploadRequestBody } from "../classes/uploadRequest";

export const uploadService = async (body: any): Promise<any> => {
  let error = "";

  if (!body || !body.length) {
    throw new Error("No File Uploaded");
  }

  //For multiple file uploads, I want to save the filename and bufferdata in a map
  let temp = new Map<string, string>();

  // Store File Read Promises
  let readFilePromises = [];

  for (let file of body) {
    readFilePromises.push(
      fs
        .readFile(file.path, { encoding: "utf8" })
        .then((data) => {
          data = data.replace(/(\r|\t)/gm, ",");

          temp.set(file.originalname, data);
        })
        .catch((err) => {
          error = err;
        })
    );
    readFilePromises.push(
      fs.unlink(file.path).catch((err) => {
        console.error(err);
      })
    );
  }

  // Using promise.all to allow file read to be asynchronous
  await Promise.all(readFilePromises);

  // Store Parsed JSON promises
  let parseJSONPromises: any[] = [];

  for (let [key, text] of temp.entries()) {
    parseJSONPromises.push(
      new Promise(async (resolve, reject) => {
        let store: any[] = [];
        await csv
          .default({ trim: true })
          .fromString(text)
          .subscribe((data) => {
            if (!data.user || !data.amount) {
              error =
                "Invalid File Header/Value (file header and values should be user and amount)";
              return;
            }
            let amount = parseFloat(data.amount);
            if (amount) {
              store.push({ user: data.user, amount });
            } else {
              error = "Invalid Amount (Amount should be an int or float)";
              return;
            }
          });
        resolve({ filename: key, data: store });
      })
    );
  }
  // Using promise.all to allow json parse to be asynchronous
  let result = await Promise.all(parseJSONPromises);

  if (error) {
    throw new Error(error);
  }
  return result;
};
