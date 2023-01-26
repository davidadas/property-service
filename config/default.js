module.exports = {
  // Service-Level Configs.
  application: {
    port: 8080,
  },
  // Service Authentication Configs.
  authentication: {
    secret: 'shhhhhh',
    algorithms: ['HS256'],
  },
  // Client Configs.
  clients: {
    houseCanary: {
      baseUrl: 'https://api.housecanary.com/v2',
      authentication: 'dummyconfig',
    },
  },
};
