class ProgressionSkinDetailsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ProgressionSkinDetailsParser.Data = csvData;
    }
    static GetName() { return ProgressionSkinDetailsParser.Data.map(row => row['Name']); }
    static GetProgressionskinbase() { return ProgressionSkinDetailsParser.Data.map(row => row['ProgressionSkinBase']); }
    static GetScreenswf() { return ProgressionSkinDetailsParser.Data.map(row => row['ScreenSWF']); }
    static GetScreenexportnameprefix() { return ProgressionSkinDetailsParser.Data.map(row => row['ScreenExportNamePrefix']); }
    static GetShowskindeliveryonlevels() { return ProgressionSkinDetailsParser.Data.map(row => row['ShowSkinDeliveryOnLevels']); }
}

export default ProgressionSkinDetailsParser;
