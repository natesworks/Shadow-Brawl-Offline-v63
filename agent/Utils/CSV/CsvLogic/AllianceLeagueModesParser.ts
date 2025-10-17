class AllianceLeagueModesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        AllianceLeagueModesParser.Data = csvData;
    }
    static GetName() { return AllianceLeagueModesParser.Data.map(row => row['Name']); }
    static GetEventslot() { return AllianceLeagueModesParser.Data.map(row => row['EventSlot']); }
    static GetModeoverrideiconname() { return AllianceLeagueModesParser.Data.map(row => row['ModeOverrideIconName']); }
    static GetModeoverrideroomiconname() { return AllianceLeagueModesParser.Data.map(row => row['ModeOverrideRoomIconName']); }
    static GetBanneroverrideswf() { return AllianceLeagueModesParser.Data.map(row => row['BannerOverrideSWF']); }
    static GetBanneroverrideexportname() { return AllianceLeagueModesParser.Data.map(row => row['BannerOverrideExportName']); }
    static GetEventteasebgcoloroverride() { return AllianceLeagueModesParser.Data.map(row => row['EventTeaseBgColorOverride']); }
    static GetPreviewtickets() { return AllianceLeagueModesParser.Data.map(row => row['PreviewTickets']); }
    static GetPreviewmaxwin() { return AllianceLeagueModesParser.Data.map(row => row['PreviewMaxWin']); }
}

export default AllianceLeagueModesParser;
