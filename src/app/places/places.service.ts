import { Injectable } from '@angular/core';
import { Places } from './places.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Places[]>([
    new Places('p1', 
      'New York', 
      'Description', 
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?ixlib=rb-1.2.1&w=1000&q=80', 
      450,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'),
    new Places('p2', 
      'France', 
      'Romance is in the air', 
      'https://cropper.watch.aetnd.com/cdn.watch.aetnd.com/sites/2/2018/05/hith-eiffel-tower-iStock_000016468972Large.jpg', 
      600,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'bca')
  ]) 

  get places() {
    return this._places.asObservable();
  }

  constructor(private authSrv: AuthService) { }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(p => p.id === id)}
    }))
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Places(Math.random().toString(), 
      title, 
      description, 
      'img', 
      price, 
      dateFrom, 
      dateTo, 
      this.authSrv.userId
      );
      return this.places.pipe(take(1), delay(1000), tap(places => {
        this._places.next(places.concat(newPlace));
      }));
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(take(1), 
    delay(1000), 
    tap(places => {
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      const updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] = new Places(oldPlace.id, 
          title, 
          description, 
          oldPlace.img, 
          oldPlace.price, 
          oldPlace.availableFrom, 
          oldPlace.availableTo, 
          oldPlace.userId
          );
          this._places.next(updatedPlaces);
    }))
  }
}
