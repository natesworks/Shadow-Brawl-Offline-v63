class EventModifiersParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        EventModifiersParser.Data = csvData;
    }
    static GetName() { return EventModifiersParser.Data.map(row => row['Name']); }
    static GetId() { return EventModifiersParser.Data.map(row => row['Id']); }
    static GetDisabled() { return EventModifiersParser.Data.map(row => row['Disabled']); }
    static GetNametid() { return EventModifiersParser.Data.map(row => row['NameTID']); }
    static GetDescriptiontid() { return EventModifiersParser.Data.map(row => row['DescriptionTID']); }
    static GetBattleload() { return EventModifiersParser.Data.map(row => row['BattleLoad']); }
    static GetBotitempickup() { return EventModifiersParser.Data.map(row => row['BotItemPickup']); }
    static GetIsenabledinfriendly() { return EventModifiersParser.Data.map(row => row['IsEnabledInFriendly']); }
    static GetRecordsdisabled() { return EventModifiersParser.Data.map(row => row['RecordsDisabled']); }
    static GetDebugmenu() { return EventModifiersParser.Data.map(row => row['DebugMenu']); }
    static GetCustomvalue1() { return EventModifiersParser.Data.map(row => row['CustomValue1']); }
    static GetCustomvalue2() { return EventModifiersParser.Data.map(row => row['CustomValue2']); }
    static GetCustomvalue3() { return EventModifiersParser.Data.map(row => row['CustomValue3']); }
}

export default EventModifiersParser;
