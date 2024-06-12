import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  distance: number;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  baseUrl = "http://localhost:5000/api/"

  constructor(private http: HttpClient) { }

  setUser(user: string) {
    let url = this.baseUrl + "setUser"
    let body = {"username": user}
    console.log(user, url)
    let headers = new HttpHeaders({ "Content-Type": "application/json" })
    localStorage.setItem("spotify-username", user)
    return this.http.post(url, body, { headers }).subscribe()
  }
  
  getPlaylists() {
    let url = this.baseUrl + "getPlaylists"
    let headers = new HttpHeaders({ "Content-Type": "application/json" })
    return this.http.get<SpotifyPlaylist[]>(url, { headers })
  }

  getTracksFromPlaylist(pl_id: string) {
    let url = this.baseUrl + "getTracksFromPlaylist"
    let headers = new HttpHeaders({ "Content-Type": "application/json" })
    let body = {"playlist_id": pl_id}
    return this.http.post<SpotifyTrack[]>(url, body, { headers })
  }
}
