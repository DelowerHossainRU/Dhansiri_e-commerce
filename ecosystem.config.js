module.exports = {
  apps: [
    {
      name: 'dhansiri-backend',
      cwd: './backend',
      script: 'src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
