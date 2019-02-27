// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  name: 'qa',
  apiEndpoint: 'http://10.4.101.107:8093/api/v1/creditobanco',
  apiClienteEndpoint: 'http://10.4.101.160:8150/public/cliente',
  ssoEndpoint: '/sso',
  ssoLogin:'/login',
  ssoUrl: 'http://10.4.101.107:18001/sso',
  version: '0.21.0'
};
