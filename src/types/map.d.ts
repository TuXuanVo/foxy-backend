declare interface ILocation {
    latitude: number;
    longitude: number;
}

declare interface IUserLocation {
    _id: string;
    name: {
        firstName: string;
        lastName: string;
    };
    age: number;
    avatar: string;
    lastLocation: {
        latitude: number;
        longitude: number;
    };
    distance: number;
}
