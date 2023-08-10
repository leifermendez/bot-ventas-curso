module.exports = {
  apps: [
    {
      name: "chatBotVentas",
      script: "./app.js",
      max_memory_restart: "700M",
      cron_restart: "*/10 * * * *",
    },
  ],
};
