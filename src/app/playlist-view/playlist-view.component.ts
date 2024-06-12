import { Component } from '@angular/core';
import { SelectedPlaylistsTracksService } from '../services/selected-playlists-tracks.service';
import { BackendService, ImageObject, SpotifyTrack } from '../services/backend.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-playlist-view',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule],
  templateUrl: './playlist-view.component.html',
  styleUrl: './playlist-view.component.css'
})
export class PlaylistViewComponent {
  private playlist_id: string|null = "";
  private tracks: SpotifyTrack[] = [];
  displayedColumns: string[] = ['select', 'album-cover', 'track', 'artists']
  dataSource: MatTableDataSource<SpotifyTrack> = new MatTableDataSource<SpotifyTrack>();
  selection = new SelectionModel<SpotifyTrack>(true, [])
  // displayTracks: SpotifyTrack[][] = [];

  constructor(private selectedPlaylistsTracks: SelectedPlaylistsTracksService, private backend: BackendService) {
    this.playlist_id = selectedPlaylistsTracks.getPlaylistId()
    if (!this.playlist_id) { 
      this.playlist_id = localStorage.getItem("playlist-id");
    }
    backend.getTracksFromPlaylist(<string>this.playlist_id).subscribe(
      (response) => {
        this.tracks = response;
        console.log(this.tracks)
        this.dataSource = new MatTableDataSource<SpotifyTrack>(this.tracks)
      }
    )
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.selection.selected.length >= 1) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  onSelect(row: SpotifyTrack) {
    const numSelected = this.selection.selected.length
    if (numSelected < 5) {
      this.selection.toggle(row)
    }
    else {
      this.selection.deselect(row)
    }
  }

  checkboxLabel(row?: SpotifyTrack): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  getTracks() {
    return this.tracks
  }
}
