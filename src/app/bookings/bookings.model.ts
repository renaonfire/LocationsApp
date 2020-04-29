export class Bookings {
    constructor(
        public bookingId: string,
        public placeId: string, 
        public userId: string, 
        public placeTitle: string, 
        public guestNumber: number,
        public firstName: string,
        public lastName: string,
        public dateFrom: Date,
        public dateTo: Date
        ) {}
}