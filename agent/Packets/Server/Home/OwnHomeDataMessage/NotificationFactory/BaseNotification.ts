class BaseNotification {
    static Encode(stream: any, NotificationID: number, NotificationIndex: number, IsNotificationRead: boolean, NotificationTime: number, NotificationText: any): void {
        stream.WriteVInt(NotificationID);
        stream.WriteInt(NotificationIndex);
        stream.WriteBoolean(IsNotificationRead);
        stream.WriteInt(NotificationTime);
        stream.WriteString(NotificationText);
        stream.WriteVInt(0);
    }
}

export default BaseNotification