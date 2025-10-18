class NotificationFactoryConfig {
    public NotificationsCount: number;

    public NotificationID: number[];
    public NotificationIndex: number[];
    public IsRead: boolean[];
    public NotificationTime: number[];
    public NotificationMessage: string[];

    constructor(NotificationsCount: number, NotificationsID: number[], NotificationIndex: number[], IsRead: boolean[], NotificationTime: number[], NotificationMessage: string[]) 
    {
        this.NotificationsCount = NotificationsCount;
        this.NotificationID = NotificationsID;
        this.NotificationIndex = NotificationIndex;
        this.IsRead = IsRead;
        this.NotificationTime = NotificationTime;
        this.NotificationMessage = NotificationMessage;
    }
}

export default NotificationFactoryConfig;
