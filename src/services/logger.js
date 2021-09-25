const { configure, getLogger } = require('log4js');

const logLevel = process.env.LOGGING_LEVEL || 'info';

const appenders = {
  out: {
    type: 'stdout',
    layout: {
      type: 'pattern',
      pattern: '%[%d{ISO8601} [%p]%] %c [%f{2}:%l] %m',
    },
  },
};

const logConfig = {
  appenders,
  categories: {
    default: {
      appenders: Object.keys(appenders),
      level: logLevel,
      enableCallStack: true,
    },
  },
};

const buildLog = (logger) => {
  configure(logConfig);
  return {
    L: getLogger(logger),
  };
};

module.exports = buildLog;
