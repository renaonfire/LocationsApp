import { Injectable } from '@angular/core';
import { Places } from './places.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Places[] = [
    new Places('p1', 'New York', 'Description', 'https://images.unsplash.com/photo-1534430480872-3498386e7856?ixlib=rb-1.2.1&w=1000&q=80', 450),
    new Places('p2', 'France', 'Romance is in the air', 'https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/2/2018/05/hith-eiffel-tower-iStock_000016468972Large.jpg', 600)
  ];

  get places() {
    return [...this._places];
  }

  constructor() { }

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)}
  }
}
