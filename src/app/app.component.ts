import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, mapTo } from 'rxjs/operators';

export const SAVER_SPEED = 6;

export interface SaverCoordinates {
  left: number;
  leftDirection: number;
  top: number;
  topDirection: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'ng-screen-saver';
  private positions: SaverCoordinates = {
    left: 0,
    leftDirection: 1,
    top: 0,
    topDirection: 1
  };

  private static changeColor(): void {
    let fillColor = (Math.random() + 1).toString().replace('.', '');
    fillColor = fillColor.substring((fillColor.length - 6), fillColor.length);

    const circleBg = document.getElementById('icon-bg');
    circleBg.setAttribute('fill', `#${fillColor}`);
  }

  ngOnInit(): void {
    const move$ = fromEvent(document, 'mousemove').pipe(mapTo('move'));
    const stop$ = fromEvent(document, 'mousemove').pipe(mapTo('stop'));

    stop$
      .pipe(debounceTime(6000))
      .subscribe(() => this.drawScreenSaver());

    move$
      .subscribe(() => {
        setTimeout(() => {
          const saverElement = document.getElementById('screen-saver-element');
          if (saverElement) {
            saverElement.remove();
          }
        }, 500);
      });
  }

  private drawScreenSaver(): void {
    const container = document.createElement('div');
    container.className = 'screen-saver-holder';
    container.id = 'screen-saver-element';
    // tslint:disable:max-line-length
    container.innerHTML = `<svg id="rocket" xmlns="http://www.w3.org/2000/svg" width="101.678" height="101.678" viewBox="0 0 101.678 101.678">
      <g id="Group_83" transform="translate(-141 -696)">
        <circle id="icon-bg" cx="50.839" cy="50.839" r="50.839" transform="translate(141 696)" fill="#dd0031"/>
        <g id="Group_47" transform="translate(165.185 720.185)">
          <path id="Path_33" d="M3.4,42.615a3.084,3.084,0,0,0,3.553,3.553,21.419,21.419,0,0,0,12.215-6.107L9.511,30.4A21.419,21.419,0,0,0,3.4,42.615Z" transform="translate(0.371 3.363)" fill="#fff"/>
          <path id="Path_34" d="M53.3,3.221A3.09,3.09,0,0,0,50.081,0,48.227,48.227,0,0,0,18.322,13.437c-6-1.666-14.991-1.221-18.322,7.218A33.892,33.892,0,0,1,9.439,25.1l-.333.666a3.013,3.013,0,0,0,.555,3.553L23.985,43.641a2.9,2.9,0,0,0,3.553.555l.666-.333A33.892,33.892,0,0,1,32.647,53.3c8.55-3.664,8.884-12.326,7.218-18.322A48.227,48.227,0,0,0,53.3,3.221ZM34.424,9.772a6.439,6.439,0,1,1,9.106,9.106,6.368,6.368,0,0,1-9.106,0A6.467,6.467,0,0,1,34.424,9.772Z" transform="translate(0 0.005)" fill="#fff"/>
        </g>
      </g>
    </svg>`;
    document.body.append(container);

    this.moveIcon();
  }

  private moveIcon(): void {
    const svg = document.getElementById('rocket');
    if (!svg) {
      return;
    } else {
      this.positions.left += this.positions.leftDirection ? 1 : -1;
      this.positions.top += this.positions.topDirection ? 1 : -1;
      if (this.positions.left <= 0) {
        this.positions.leftDirection = 1;
        AppComponent.changeColor();
      } else if (this.positions.left >= window.innerWidth - 100) {
        this.positions.leftDirection = 0;
        AppComponent.changeColor();
      }

      if (this.positions.top <= 0) {
        this.positions.topDirection = 1;
        AppComponent.changeColor();
      } else if (this.positions.top >= window.innerHeight - 100) {
        this.positions.topDirection = 0;
        AppComponent.changeColor();
      }


      svg.style.left = `${this.positions.left}px`;
      svg.style.top = `${this.positions.top}px`;
      setTimeout(() => this.moveIcon(), SAVER_SPEED);
    }
  }
}
