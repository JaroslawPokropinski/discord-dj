import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(
    private http: HttpClient
  ) { }
  addSong(songTitle: string) {
    return this.http.post(`${environment.serverUrl}/addSong`, {title: songTitle});
  }
}
