import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: object;
  href: string;
  id: string;
  images: ImageBitmap[];
  name: string;
  owner: object;
  public: boolean;
  snapshot_id: string;
  tracks: object;
  type: string;
  uri: string;
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
    let headers = new HttpHeaders({ "Content-Type": "application/json"})
    localStorage.setItem("spotify-username", user)
    return this.http.post(url, body, { headers }).subscribe()
  }
  
  getPlaylists() {
    let url = this.baseUrl + "getPlaylists"
    let headers = new HttpHeaders({ "Content-Type": "application/json"})
    return this.http.get<SpotifyPlaylist[]>(url, { headers })
  }
}
