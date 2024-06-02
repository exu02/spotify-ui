import { Component } from '@angular/core';
import { SelectedPlaylistsTracksService } from '../services/selected-playlists-tracks.service';
import { BackendService, ImageObject, SpotifyTrack } from '../services/backend.service';
import { NgForOf, NgIf } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-playlist-view',
  standalone: true,
  imports: [NgForOf, NgIf, MatButtonToggleModule],
  templateUrl: './playlist-view.component.html',
  styleUrl: './playlist-view.component.css'
})
export class PlaylistViewComponent {
  private playlist_id: string|null
  tracks: SpotifyTrack[] = [];
  displayTracks: SpotifyTrack[][] = [];

  constructor(private selectedPlaylistsTracks: SelectedPlaylistsTracksService, private backend: BackendService) {
    this.playlist_id = selectedPlaylistsTracks.getPlaylistId()
    if (!this.playlist_id) { 
      this.playlist_id = localStorage.getItem("playlist-id");
    }
    backend.getTracksFromPlaylist(<string>this.playlist_id).subscribe(
      (response) => {
        this.tracks = response;
      }
    )
  }

  getTracks() {
    return this.tracks
  }
}
