class LocalNotificationsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        LocalNotificationsParser.Data = csvData;
    }
    static GetName() { return LocalNotificationsParser.Data.map(row => row['Name']); }
    static GetPriority() { return LocalNotificationsParser.Data.map(row => row['Priority']); }
    static GetNotificationtext() { return LocalNotificationsParser.Data.map(row => row['NotificationText']); }
    static GetIsregulareventrefresh() { return LocalNotificationsParser.Data.map(row => row['IsRegularEventRefresh']); }
    static GetDontcompare() { return LocalNotificationsParser.Data.map(row => row['DontCompare']); }
    static GetAutoadd() { return LocalNotificationsParser.Data.map(row => row['AutoAdd']); }
    static GetTimeoffsetmins() { return LocalNotificationsParser.Data.map(row => row['TimeOffsetMins']); }
    static GetMaxrandomtimeoffsetmins() { return LocalNotificationsParser.Data.map(row => row['MaxRandomTimeOffsetMins']); }
    static GetCheckrangemins() { return LocalNotificationsParser.Data.map(row => row['CheckRangeMins']); }
}

export default LocalNotificationsParser;
