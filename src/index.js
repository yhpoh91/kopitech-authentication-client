require('dotenv').config();
const axios = require('axios');

const { L } = require('kopitech-logger')('Authentication Client');

const currentConfig = {
  enabled: (process.env.AUTHENTICATION_ENABLED || 'true').toLowerCase() === 'true',
  verifyUrl: process.env.AUTHENTICATION_VERIFY_URL,

  noAuthSubject: process.env.AUTHENTICATION_NO_AUTH_SUBJECT || 'noauthsub',
  noAuthType: process.env.AUTHENTICATION_NO_AUTH_TYPE || 'client',

  logEnabled: (process.env.AUTHENTICATION_LOG_ENABLED || 'true').toLowerCase() === 'true',
  logConfig: (process.env.AUTHENTICATION_LOG_CONFIG || 'false').toLowerCase() === 'true',
};
currentConfig.logEnabled && currentConfig.logConfig && L.info(currentConfig);

const authenticate = async (accessToken) => {
  try {
    const url = currentConfig.verifyUrl;
    const body = { accessToken };

    const response = await axios.post(url, body);
    const { data } = response;
    return Promise.resolve(data);
  } catch (error) {
    L.error(error); 
    return Promise.reject(error);
  }
}

const configure = (config = {}) => {
  if (config.logEnabled != null) {
    currentConfig.logEnabled = config.logEnabled;
    currentConfig.logEnabled && L.info(`Updating Config [Log Enabled] - ${config.logEnabled}`);
  }

  if (config.logConfig != null) {
    currentConfig.logConfig = config.logConfig;
    currentConfig.logEnabled && L.info(`Updating Config [Log Config] - ${config.logConfig}`);
  }

  if (config.enabled != null) {
    currentConfig.enabled = config.enabled;
    currentConfig.logEnabled && L.info(`Updating Config [Authentication Enabled] - ${config.enabled}`);
  }

  if (config.verifyUrl != null) {
    currentConfig.verifyUrl = config.verifyUrl;
    currentConfig.logEnabled && L.info(`Updating Config [Verify URL] - ${config.verifyUrl}`);
  }

  if (config.noAuthSubject != null) {
    currentConfig.noAuthSubject = config.noAuthSubject;
    currentConfig.logEnabled && L.info(`Updating Config [NoAuth Subject] - ${config.noAuthSubject}`);
  }

  if (config.noAuthType != null) {
    currentConfig.noAuthType = config.noAuthType;
    currentConfig.logEnabled && L.info(`Updating Config [NoAuth Type] - ${config.noAuthType}`);
  }

  currentConfig.logEnabled && L.info(`Config Updated`);
  currentConfig.logEnabled && currentConfig.logConfig && L.info(currentConfig);
};

const expressAuthenticate = async (req, res, next) => {
  try {
    let token;

    // Ensure authorization header is present
    if (currentConfig.enabled) {
      const authorizationHeader = req.headers['authorization'];
      if (authorizationHeader == null) {
        res.status(401).send('invalid authorization header');
        return;
      }

      const prefix = 'Bearer ';
      if (authorizationHeader.indexOf(prefix) < 0) {
        res.status(401).send('invalid authorization header');
        return;
      }

      token = authorizationHeader.slice(prefix.length);
    }

    // Check Access
    let hasAccess = false;
    
    // Support NoAuth
    if (!currentConfig.enabled) {
      hasAccess = true;
      req.accessor = {
        sub: currentConfig.noAuthSubject,
        typ: currentConfig.noAuthType,
      };
    }

    if (!hasAccess) {
      // Validate Token
      const { ok: isValidated, payload } = await authenticate(token);
      if (isValidated && payload) {
        const { sub, typ } = payload;

        hasAccess = true;
        req.accessor = payload;
      }
    }

    if (!hasAccess) {
      res.status(401).send('unauthorized');
      return;
    }

    next();
  } catch (error) {
    currentConfig.logEnabled && L.error(error); 
    res.status(401).send('unauthorized');
  }
};

module.exports = {
  configure,
  authenticate,
  expressAuthenticate,
};
