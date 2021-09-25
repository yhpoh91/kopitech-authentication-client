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
`authenticationEnabled` (BOOLEAN: default true) (env `AUTHENTICATION_ENABLED`) - Whether authentication should be enabled
`authenticatorVerifyUrl` (STRING) (env `AUTHENTICATOR_SERVICE_VERIFY_URL`) - Kopitech Authenticator Service Verify URL

`noAuthSub` (STRING: default `noauthsub`) (env `AUTHENTICATION_NO_AUTH_SUBJECT` - Subject ID used when Authentication is disabled
`noAuthTyp` (STRING: default `client`) (env `AUTHENTICATION_NO_AUTH_TYPE` - Subject Type used when Authentication is disabled

`logConfig` (BOOLEAN: default false) (env `AUTHENTICATION_LOG_CONFIG`) - Whether to log config upon changes

## Available Functions
### Configure
**authenticationClient#configure(config)**

#### Configuration
```
{
  authenticationEnabled: true,
  authenticatorVerifyUrl: http://localhost:8080/auth/verify,

  noAuthSub: 'noauthsub',
  noAuthTyp: 'client',

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
