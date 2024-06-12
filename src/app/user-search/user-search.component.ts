import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BackendService, SpotifyPlaylist, ImageObject } from '../services/backend.service';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SelectedPlaylistsTracksService } from '../services/selected-playlists-tracks.service';

function makeWelcomeMsg(user: string|null): string {
  var welcomMsg = `Hi ${user}! Select one of your public Spotify playlists below to begin, or switch users here:`
  return welcomMsg
} 

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgForOf, MatButtonModule, MatFormField, MatInputModule, MatIconModule],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearchComponent {
  value = "";
  user: string|null = "";
  welcomeMsg: string = "";
  defaultMsg: string = "Hi! Type your Spotify username below to begin:";
  userForm = new FormControl("");
  playlists: SpotifyPlaylist[]|any;

  constructor(private backend: BackendService, private selectedPlaylistsTracks: SelectedPlaylistsTracksService) {
    this.user = localStorage.getItem("spotify-username")
    if (this.user) {
      this.backend.setUser(<string>this.user);
      this.backend.getPlaylists().subscribe(
        (response) => {
          this.playlists = response
          console.log("response", this.playlists)
        }
      )
      // this.existingUserMsg = "Hi " + this.user + "! Select one of your public Spotify playlists below to begin, or switch users here:"
      this.welcomeMsg = makeWelcomeMsg(this.user)
    }
    else {
      this.welcomeMsg = this.defaultMsg
    }
  }

  onSubmitUser() {
    this.user = this.userForm.value;
    this.backend.setUser(<string>this.user);
    this.backend.getPlaylists().subscribe(
      (response) => {
        this.playlists = response
        console.log("response", this.playlists)
      }
    )
    this.welcomeMsg = makeWelcomeMsg(this.user)
  }

  onSelectPlaylist(pl_id: string) {
    this.selectedPlaylistsTracks.setPlaylistId(pl_id)
    localStorage.setItem("playlist-id", pl_id)
  }
}
