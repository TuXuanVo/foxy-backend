declare enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
}
declare interface iMessageCreate {
    idReceive: string;
    messages: [
        {
            type: MessageType;
            value: string;
        },
    ];
    exp: number;
}
