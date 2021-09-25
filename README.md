# Kopitech Authentication Client
A client library for authenticating access token using the kopitech authenticator service.

## Installation
Using `npm`:
```npm install --save kopitech-authentication-client```

## Usage
```
const authenticationClient = require('kopitech-authentication-client');

expressApp.get(
  '/',
  authenticator.authenticationClient,
  (req, res) => {
    const { sub, typ } = req.accessor;
    console.log('Request Authenticated for ${sub} of type ${typ}`);
    res.send('ok');
  },
);
```

## Config
`enabled` (BOOLEAN: default true) - Whether authentication should be enabled

`verifyUrl` (STRING) - Kopitech Authenticator Service Verify URL

`noAuthSubject` (STRING: default `noauthsub`) - Subject ID used when Authentication is disabled

`noAuthType` (STRING: default `client`) - Subject Type used when Authentication is disabled

`logEnabled` (BOOLEAN: default true) - Whether to log

`logConfig` (BOOLEAN: default false) - Whether to log config upon changes


## Environment Variable
`AUTHENTICATION_ENABLED` (BOOLEAN: default true) - Whether authentication should be enabled

`AUTHENTICATION_VERIFY_URL` (STRING) (env `AUTHENTICATION_VERIFY_URL`) - Kopitech Authenticator Service Verify URL

`AUTHENTICATION_NO_AUTH_SUBJECT` (STRING: default `noauthsub`) - Subject ID used when Authentication is disabled

`AUTHENTICATION_NO_AUTH_TYPE` (STRING: default `client`) - Subject Type used when Authentication is disabled

`AUTHENTICATION_LOG_ENABLED` (BOOLEAN: default true) - Whether to log

`AUTHENTICATION_LOG_CONFIG` (BOOLEAN: default false) - Whether to log config upon changes

`LOGGING_ENABLED` (BOOLEAN default: true) - Whether authentication should be enabled

`LOGGING_LEVEL` (BOOLEAN default: info) - Log level to be used (debug, info, warn, error)


## Available Functions
### Configure
**authenticationClient#configure(config)**

#### Configuration
```
{
  enabled: true,
  verifyUrl: http://localhost:8080/auth/verify,

  noAuthSubject: 'noauthsub',
  noAuthType: 'client',

  logEnabled: true,
  logConfig: false
}
```

### Authenticate
**authenticationClient#authenticate(accessToken)**

Returned data

```
{
  ok: true, // Access Token is validated
  payload: {
    sub: 'subject', // Authenticated Subject
    typ: 'client', // Authenticated Type
  }
}
```

### Express Authenticate
Express controller to authenticate request (Authorization Bearer Header)

**authenticationClient#expressAuthenticate**

Express controller will:

- proceed with `next()` called if authenticated
- respond with `401 Unauthorized` if not authenticated

Additional `request` fields:

```
accessor: {
  sub: 'subject', // Authenticated Subject
  typ: 'client', // Authenticated Type
}
```

## Contributions
Contributions to the Library are welcomed.
