import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Buffer } from 'buffer';

export interface SpotifyAuth {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenData {
  token: string;
  expiration: number;
}

export interface ImageObject {
  height: string|null;
  url: string;
  width: string|null;
}

export interface SpotifyPlaylist {
  href: string;
  limit: number;
  next: string|null;
  offset: number;
  previous: string|null;
  total: number;
  items: {
    collaborative: boolean;
    description: string;
    external_urls: object;
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    owner: object;
    public: boolean;
    snapshot_id: string;
    tracks: object;
    type: string;
    uri: string;
  }[]
}

export interface SpotifyTrack {
  album: {
    images: ImageObject[];
    name: string;
    id: string;
  };
  artists: {
    name: string;
    id: string;
  }[];
  name: string;
  id: string;
  similarity: number;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  baseUrl = "https://api.spotify.com/v1/";
  username: string = "";
  tokenObject: TokenData = {token: "", expiration: 0};
  userPlaylists: SpotifyPlaylist[] = [];

  constructor(private http: HttpClient) { 
    this.getNewClientCredentials();
   }

  setUser(user: string) {
    this.username = user;
  }

  getUser() {
    return this.username;
  }

  getToken() {
    if (this.isTokenExpired()) {
      this.getNewClientCredentials();
    }
    return this.tokenObject;
  }

  rightNow() {
    let currTime = Math.floor(Date.now() / 1000);
    return currTime;
  }

  getNewClientCredentials() {
    let url = "https://accounts.spotify.com/api/token";
    let client_id = environment.clientId;
    let client_secret = environment.clientSecret;
    let headers = new HttpHeaders({ 
      "Authorization": "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    });
    let body = "grant_type=client_credentials";
    console.log("Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"))
    this.http.post<SpotifyAuth>(url, body, { headers }).subscribe(
      (response) => {
        this.tokenObject.token = response.access_token;
        this.tokenObject.expiration = this.rightNow() + response.expires_in;
      }
    );
  }

  isTokenExpired() {
    let expired = false;
    if (this.rightNow() >= this.tokenObject.expiration) {
      expired = true;
    }
    return expired;
  }
  
  getPlaylists() {
    if (this.isTokenExpired()) {
      this.getNewClientCredentials();
    };
    let url = this.baseUrl + "users/" + this.username + "/playlists";
    let headers = new HttpHeaders({
      "Authorization": "Bearer " + this.tokenObject.token
    });
    return this.http.get<SpotifyPlaylist>(url, { headers });
  }

  getTracksFromPlaylist(pl_id: string) {
    if (this.isTokenExpired()) {
      this.getNewClientCredentials();
    };
    let url = this.baseUrl + "getTracksFromPlaylist";
    let headers = new HttpHeaders({ "Content-Type": "application/json" });
    let body = {"playlist_id": pl_id};
    return this.http.post<SpotifyTrack[]>(url, body, { headers });
  }

  getPlaylistAnalysis(selectedTracks: SpotifyTrack[], playlistTracks: SpotifyTrack[]) {
    let url = this.baseUrl + "analyzePlaylist"
    let headers = new HttpHeaders({ "Content-Type": "application/json" })
    let body = {
      "selected_tracks": selectedTracks,
      "playlist_tracks": playlistTracks
    }
    return this.http.post<SpotifyTrack[]>(url, body, { headers })
  }
}
