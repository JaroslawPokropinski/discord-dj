import { Component, OnInit } from '@angular/core';
import { SongService } from '../song.service';

@Component({
  selector: 'app-song-controller',
  templateUrl: './song-controller.component.html',
  styleUrls: ['./song-controller.component.css']
})
export class SongControllerComponent implements OnInit {

  songName = '';

  constructor(
    private songService: SongService
  ) { }

  ngOnInit() {
  }

  onAddSong() {
    this.songService.addSong(this.songName).subscribe();
  }

}
