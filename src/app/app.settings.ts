import {environment} from "../environments/environment";
export class AppSettings {
  // TODO: volar esto, se puede importar esto directamente environment en todos lados
  public static get API_ENDPOINT(): string { return environment.apiEndpoint } // esto lo agarra el proxy
  public static get API_CLIENTE_ENDPOINT(): string { return environment.apiClienteEndpoint }
  public  static get SSO_ENDPOINT(): string { return environment.ssoEndpoint }
}
