import { Component, ViewChild } from '@angular/core';
import { SelectedPlaylistsTracksService } from '../services/selected-playlists-tracks.service';
import { BackendService, ImageObject, SpotifyTrack } from '../services/backend.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-playlist-view',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule, MatButtonModule, MatSortModule, NgForOf, NgIf],
  templateUrl: './playlist-view.component.html',
  styleUrl: './playlist-view.component.css'
})
export class PlaylistViewComponent {
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  private playlist_id: string|null = "";
  private tracks: SpotifyTrack[] = [];
  displayedColumns: string[] = ['select', 'album-cover', 'track', 'artists']
  dataSource: MatTableDataSource<SpotifyTrack> = new MatTableDataSource<SpotifyTrack>();
  selection = new SelectionModel<SpotifyTrack>(true, [])
  // displayTracks: SpotifyTrack[][] = [];

  constructor(private selectedPlaylistsTracks: SelectedPlaylistsTracksService, private backend: BackendService, private router: Router) {
    this.playlist_id = selectedPlaylistsTracks.getPlaylistId()
    if (!this.playlist_id) { 
      this.playlist_id = localStorage.getItem("playlist-id");
    }
    this.tracks = JSON.parse(<string>localStorage.getItem(<string>this.playlist_id))
    if (this.tracks) {
      this.dataSource = new MatTableDataSource<SpotifyTrack>(this.tracks)
    }
    else {
      backend.getTracksFromPlaylist(<string>this.playlist_id).subscribe(
        (response) => {
          this.tracks = response;
          console.log(this.tracks)
          this.dataSource = new MatTableDataSource<SpotifyTrack>(this.tracks);
          localStorage.setItem(<string>this.playlist_id, JSON.stringify(this.tracks));
        }
      )
    }
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
  }

  onSelectTrack(row: SpotifyTrack) {
    const numSelected = this.selection.selected.length;
    if (numSelected < 5) {
      this.selection.toggle(row);
    }
    else {
      this.selection.deselect(row);
    }
  }

  onClickAnalyze() {
    this.backend.getPlaylistAnalysis(this.selection.selected, this.tracks).subscribe(
      (response) => {
        this.tracks = response;
        localStorage.setItem(<string>this.playlist_id, JSON.stringify(this.tracks));
        this.dataSource.data.forEach(
          (tr, i) => tr.similarity = this.tracks[i].similarity
        )
        localStorage.setItem(<string>this.playlist_id, JSON.stringify(this.tracks));
        this.dataSource.sort = this.sort;
      }
    )
    if (!this.displayedColumns.includes('similarity')) {
      this.displayedColumns.push('similarity');
    }

  }

  resetComponent() {
    const url = this.router.url
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
    });
  }

  navigateHome() {
    this.router.navigateByUrl('/')
  }

  checkboxLabel(row?: SpotifyTrack): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

}
