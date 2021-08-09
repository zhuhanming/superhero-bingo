module.exports = {
  apps: [
    {
      name: "superhero-bingo",
      script: "./server/src/index.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
