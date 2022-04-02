import { uploadService } from "../services/upload.service";
import { Context, Next } from "koa";

export const uploadController = async (
  ctx: Context,
  next: Next
): Promise<void | Context> => {
  console.log("Start - Handle inbound request");

  try {
    const data = await uploadService(ctx.request.files);
    ctx.status = 200;
    ctx.body = {
      message: "file is valid",
      data,
    };
  } catch (err: any) {
    console.log(err);
    ctx.status = 400;
    ctx.body = { message: "file is invalid", error: err.message };
  }
  console.log("End - Handle inbound request");
  return ctx;
};
