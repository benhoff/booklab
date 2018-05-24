import { Component } from '@angular/core';
import { NullValidationHandler, OAuthService } from 'angular-oauth2-oidc';

import { authConfig } from './auth.config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BookLab';
  login = false;


  /**
   * Construct a new {@link AppComponent{.
   *
   * @param oauthService {OAuthService} oauthService The services used as OAuth client.
   */
  constructor(private oauthService: OAuthService) {
      this.configureAuthorization();
  }

  /**
   * Configure the OAuth authorization for the REST API we connect to.
   */
  private configureAuthorization() {
      this.oauthService.configure(authConfig);
      this.oauthService.tokenValidationHandler = new NullValidationHandler();

  }
}
