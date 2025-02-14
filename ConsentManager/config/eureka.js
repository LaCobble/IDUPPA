const Eureka = require('eureka-js-client').Eureka;

const client = new Eureka({
  instance: {
    app: 'provider-microservice',
    hostName: process.env.HOSTNAME || 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: 'http://localhost:8086',
    port: {
      '$': 8086,
      '@enabled': true,
    },
    vipAddress: 'provider-microservice',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    host: process.env.EUREKA_URL || 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/'
  }
});

module.exports = client;
