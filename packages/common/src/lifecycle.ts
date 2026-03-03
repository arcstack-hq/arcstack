export const bindGracefulShutdown = (shutdown: () => Promise<void> | void) => {
  ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
    process.on(signal, async () => {
      await shutdown();
    });
  });
};
