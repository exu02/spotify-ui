import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BackendService, SpotifyPlaylist } from '../services/backend.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearchComponent {

  user: string|null = "";
  welcomeMsg: string = ""
  userForm = new FormControl("")
  playlists: SpotifyPlaylist[]|any;

  constructor(private backend: BackendService) {
    this.user = localStorage.getItem("spotify-username")
    if (this.user) {
      this.backend.getPlaylists().subscribe(
        (response) => {
          this.playlists = response
          console.log("response", this.playlists)
        }
      )
      this.welcomeMsg = "Hi " + this.user + "! Select one of your public Spotify playlists below to begin, or switch users here:"
    }
    else {
      this.welcomeMsg = "Hi! Type your Spotify username below to begin:"
    }
  }

  onSubmit(evt: any) {
    this.user = this.userForm.value;
    this.backend.setUser(<string>this.user);
    this.backend.getPlaylists().subscribe(
      (response) => {
        this.playlists = response
        console.log("response", this.playlists)
      }
    )
  }
}
