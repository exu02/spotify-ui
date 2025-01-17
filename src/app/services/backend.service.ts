import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
}

export interface SpotifyTrack {
  track: {
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
  }
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  baseUrl = "https://accounts.spotify.com/api/";
  username: string = "";
  tokenObject: TokenData = {token: "", expiration: 0};

  constructor(private http: HttpClient) { 
    this.getNewClientCredentials();
   }

  setUser(user: string) {
    this.username = user;
  }

  getUser() {
    return this.username;
  }

  rightNow() {
    let currTime = Math.floor(Date.now() / 1000);
    return currTime;
  }

  getNewClientCredentials() {
    let url = this.baseUrl + "token";
    let client_id = environment.clientId;
    let client_secret = environment.clientSecret;
    let headers = new HttpHeaders({ 
      "Content-Type": "application/json", 
      "Authorization": "Basic " + (new (Buffer as any).from(client_id + ":" + client_secret).toString("base64")) });
    let body = {"grant_type": "client_credentials"};
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
    }
  }

  getTracksFromPlaylist(pl_id: string) {
    let url = this.baseUrl + "getTracksFromPlaylist";
    let headers = new HttpHeaders({ "Content-Type": "application/json" });
    let body = {"playlist_id": pl_id};
    return this.http.post<SpotifyTrack[]>(url, body, { headers });
  }
}
