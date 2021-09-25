const axios = require('axios');

const { L } = require('./services/logger')('Authentication Client');

const currentConfig = {
  authenticationEnabled: (process.env.AUTHENTICATION_ENABLED || 'true').toLowerCase() === 'true',
  authenticatorVerifyUrl: process.env.AUTHENTICATOR_SERVICE_VERIFY_URL,

  noAuthSub: process.env.AUTHENTICATION_NO_AUTH_SUBJECT || 'noauthsub',
  noAuthTyp: process.env.AUTHENTICATION_NO_AUTH_TYPE || 'client',

  logConfig: (process.env.AUTHENTICATION_LOG_CONFIG || 'false').toLowerCase() === 'true',
}

const authenticate = async (accessToken) => {
  try {
    const url = currentConfig.authenticatorVerifyUrl;
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
  if (config.authenticationEnabled != null) {
    L.info(`Updating Config [Authentication Enabled] - ${config.authenticationEnabled}`);
    currentConfig.authenticationEnabled = config.authenticationEnabled;
  }

  if (config.authenticatorVerifyUrl != null) {
    L.info(`Updating Config [Verify URL] - ${config.authenticatorVerifyUrl}`);
    currentConfig.authenticatorVerifyUrl = config.authenticatorVerifyUrl;
  }

  if (config.logConfig != null) {
    L.info(`Updating Config [Log Config] - ${config.authenticatorVerifyUrl}`);
    currentConfig.logConfig = config.logConfig;
  }

  if (config.noAuthSub != null) {
    L.info(`Updating Config [NoAuth Subject] - ${config.noAuthSub}`);
    currentConfig.noAuthSub = config.noAuthSub;
  }

  if (config.noAuthTyp != null) {
    L.info(`Updating Config [NoAuth Type] - ${config.noAuthTyp}`);
    currentConfig.noAuthTyp = config.noAuthTyp;
  }

  L.info(`Config Updated`);
  if (currentConfig.logConfig) {
    L.info(currentConfig);
  }
};

const expressAuthenticate = async (req, res, next) => {
  try {
    let token;

    // Ensure authorization header is present
    if (currentConfig.authenticationEnabled) {
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
    if (!currentConfig.authenticationEnabled) {
      hasAccess = true;
      req.accessor = {
        sub: currentConfig.noAuthSub,
        typ: currentConfig.noAuthTyp,
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
    L.error(error); 
    res.status(401).send('unauthorized');
  }
};

module.exports = {
  configure,
  authenticate,
  expressAuthenticate,
};
