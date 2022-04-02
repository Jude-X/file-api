import request from "supertest";
import { app } from "../../src/index";

const supertest = request.agent(app.listen());

describe("Tests", () => {
  beforeAll(() => jest.setTimeout(1000));

  afterAll(() => {
    app.terminate();
  });

  describe("Health Check", () => {
    it("Should Return Body of UP and status 200", async () => {
      const res = await supertest
        .get("/")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const data = res.body;
      expect(res.status).toEqual(200);
    });
  });

  describe("File Link", () => {
    it("Valid File", async () => {
      const res = await supertest
        .post("/file/link")
        .send({
          url: "https://raw.githubusercontent.com/Jude-X/file-api/main/valid-test.csv",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(200);
      expect(message).toEqual("file is valid");
      expect(data).toBeDefined();
      expect(error).toBeUndefined();
    });

    it("Invalid File - Empty File", async () => {
      const res = await supertest
        .post("/file/link")
        .send({ url: "" })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(400);
      expect(message).toEqual("file is invalid");
      expect(data).toBeUndefined();
      expect(error).toEqual("url parameter is missing from body");
    });

    it("Invalid File - No URL", async () => {
      const res = await supertest
        .post("/file/link")
        .send({})
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(400);
      expect(message).toEqual("file is invalid");
      expect(data).toBeUndefined();
      expect(error).toEqual("url parameter is missing from body");
    });

    it("Invalid File - Wrong Header", async () => {
      const res = await supertest
        .post("/file/link")
        .send({
          url: "https://raw.githubusercontent.com/Jude-X/file-api/main/invalid-test-1.csv",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(400);
      expect(message).toEqual("file is invalid");
      expect(data).toBeUndefined();
      expect(error).toEqual(
        "Invalid File Header/Value (file header and values should be user and amount)"
      );
    });

    it("Invalid File - Missing Column", async () => {
      const res = await supertest
        .post("/file/link")
        .send({
          url: "https://raw.githubusercontent.com/Jude-X/file-api/main/invalid-test-2.csv",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(400);
      expect(message).toEqual("file is invalid");
      expect(data).toBeUndefined();
      expect(error).toEqual(
        "Invalid File Header/Value (file header and values should be user and amount)"
      );
    });

    it("Invalid File - Invalid Amount", async () => {
      const res = await supertest
        .post("/file/link")
        .send({
          url: "https://raw.githubusercontent.com/Jude-X/file-api/main/invalid-test-3.csv",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(400);
      expect(message).toEqual("file is invalid");
      expect(data).toBeUndefined();
      expect(error).toEqual(
        "Invalid Amount (Amount should be an int or float)"
      );
    });
  });

  describe("File Upload", () => {
    it("Valid File", async () => {
      const res = await supertest
        .post("/file/upload")
        .attach("file", `${__dirname}/../../valid-test.csv`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(200);
      expect(message).toEqual("file is valid");
      expect(data).toBeDefined();
      expect(error).toBeUndefined();
    });

    it("2 Valid Files - Multiple Files", async () => {
      const res = await supertest
        .post("/file/upload")
        .attach("file", `${__dirname}/../../valid-test.csv`)
        .attach("file", `${__dirname}/../../valid-test.txt`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(200);
      expect(message).toEqual("file is valid");
      expect(data).toBeDefined();
      expect(error).toBeUndefined();
    });

    it("1 Valid File, 1 Invalid File - Multiple Files", async () => {
      const res = await supertest
        .post("/file/upload")
        .attach("file", `${__dirname}/../../valid-test.csv`)
        .attach("file", `${__dirname}/../../invalid-test-1.txt`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(400);
      expect(message).toEqual("file is invalid");
      expect(data).toBeUndefined();
      expect(error).toBeDefined();
    });

    it("Invalid File - No File", async () => {
      const res = await supertest
        .post("/file/upload")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(400);
      expect(message).toEqual("file is invalid");
      expect(data).toBeUndefined();
      expect(error).toEqual("No File Uploaded");
    });

    it("Invalid File - Wrong Header", async () => {
      const res = await supertest
        .post("/file/upload")
        .attach("file", `${__dirname}/../../invalid-test-1.csv`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(400);
      expect(message).toEqual("file is invalid");
      expect(data).toBeUndefined();
      expect(error).toEqual(
        "Invalid File Header/Value (file header and values should be user and amount)"
      );
    });

    it("Invalid File - Wrong Header", async () => {
      const res = await supertest
        .post("/file/upload")
        .attach("file", `${__dirname}/../../invalid-test-1.csv`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(400);
      expect(message).toEqual("file is invalid");
      expect(data).toBeUndefined();
      expect(error).toEqual(
        "Invalid File Header/Value (file header and values should be user and amount)"
      );
    });

    it("Invalid File - Missing Column", async () => {
      const res = await supertest
        .post("/file/upload")
        .attach("file", `${__dirname}/../../invalid-test-2.csv`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(400);
      expect(message).toEqual("file is invalid");
      expect(data).toBeUndefined();
      expect(error).toEqual(
        "Invalid File Header/Value (file header and values should be user and amount)"
      );
    });

    it("Invalid File - Invalid Amount", async () => {
      const res = await supertest
        .post("/file/upload")
        .attach("file", `${__dirname}/../../invalid-test-3.csv`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const { message, data, error } = res.body;
      expect(res.status).toEqual(400);
      expect(message).toEqual("file is invalid");
      expect(data).toBeUndefined();
      expect(error).toEqual(
        "Invalid Amount (Amount should be an int or float)"
      );
    });
  });
});
