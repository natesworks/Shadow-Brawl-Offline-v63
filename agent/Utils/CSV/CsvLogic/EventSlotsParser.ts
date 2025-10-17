class EventSlotsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        EventSlotsParser.Data = csvData;
    }
    static GetName() { return EventSlotsParser.Data.map(row => row['Name']); }
    static GetSlot() { return EventSlotsParser.Data.map(row => row['Slot']); }
    static GetBgcoloroverride() { return EventSlotsParser.Data.map(row => row['BgColorOverride']); }
    static GetEventiconoverride() { return EventSlotsParser.Data.map(row => row['EventIconOverride']); }
    static GetTrophyworldiconexportpath() { return EventSlotsParser.Data.map(row => row['TrophyWorldIconExportPath']); }
}

export default EventSlotsParser;
