/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SecureHttpService } from './secure-http.service';

describe('SecureHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecureHttpService]
    });
  });

  it('should ...', inject([SecureHttpService], (service: SecureHttpService) => {
    expect(service).toBeTruthy();
  }));
});
