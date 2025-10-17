class MessagesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        MessagesParser.Data = csvData;
    }
    static GetName() { return MessagesParser.Data.map(row => row['Name']); }
    static GetTid() { return MessagesParser.Data.map(row => row['TID']); }
    static GetBubbleoverridetid() { return MessagesParser.Data.map(row => row['BubbleOverrideTID']); }
    static GetDisabled() { return MessagesParser.Data.map(row => row['Disabled']); }
    static GetMessagetype() { return MessagesParser.Data.map(row => row['MessageType']); }
    static GetFilename() { return MessagesParser.Data.map(row => row['FileName']); }
    static GetDefaultexportname() { return MessagesParser.Data.map(row => row['DefaultExportName']); }
    static GetPopoverexportnameoverride() { return MessagesParser.Data.map(row => row['PopoverExportNameOverride']); }
    static GetQuickemojitype() { return MessagesParser.Data.map(row => row['QuickEmojiType']); }
    static GetSortpriority() { return MessagesParser.Data.map(row => row['SortPriority']); }
    static GetAgegated() { return MessagesParser.Data.map(row => row['AgeGated']); }
    static GetAvailableinclub() { return MessagesParser.Data.map(row => row['AvailableInClub']); }
}

export default MessagesParser;
