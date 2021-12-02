import { TestBed } from '@angular/core/testing';

import { ParticipantdataService } from './participantdata.service';

describe('ParticipantdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParticipantdataService = TestBed.get(ParticipantdataService);
    expect(service).toBeTruthy();
  });
});
