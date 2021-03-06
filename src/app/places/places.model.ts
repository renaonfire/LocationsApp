import { PlaceLocation } from './location.model';

export class Places {
    constructor(public id: string, 
                public title: string, 
                public description: string, 
                public img: string, 
                public price: number,
                public availableFrom: Date,
                public availableTo: Date,
                public userId: string,
                public location: PlaceLocation
                ) {}
}