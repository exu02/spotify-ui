import { Injectable } from '@angular/core';
import { SpotifyPlaylist } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class SelectedPlaylistsTracksService {
  playlist_id: string = ""

  constructor() { }

  setPlaylistId(pl_id: string) {
    this.playlist_id = pl_id
  }

  getPlaylistId() {
    return this.playlist_id
  }
}
