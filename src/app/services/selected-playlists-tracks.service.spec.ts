import { TestBed } from '@angular/core/testing';

import { SelectedPlaylistsTracksService } from './selected-playlists-tracks.service';

describe('SelectedPlaylistsTracksService', () => {
  let service: SelectedPlaylistsTracksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedPlaylistsTracksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
