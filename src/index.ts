import App from "./app";

export const app = new App();

export const runServer = async (): Promise<void> => {
  /**
   * KOA Rest Server
   */
  const app = new App();
  app.listen(process.env.PORT, () => {
    console.log(`HTTP Server listening on port ${process.env.PORT}`);
  });
};

process.on("uncaughtException", (err) => {
  console.error(`process on uncaughtException error: ${err}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`process on unhandledRejection error: ${err}`);
});

try {
  runServer();
} catch (err) {
  console.error("Error while starting gRPC server", err);
}
