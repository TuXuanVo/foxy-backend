declare interface iNotificationCreate {
    type: NotificationType;
    message: string;
    user: string[];
}
declare interface iMatchUser {
    _id: string;
    name: {
        firstName: string;
        lastName: string;
    };
}
