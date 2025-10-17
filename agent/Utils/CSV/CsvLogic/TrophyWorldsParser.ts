class TrophyWorldsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        TrophyWorldsParser.Data = csvData;
    }
    static GetName() { return TrophyWorldsParser.Data.map(row => row['Name']); }
    static GetWorldnumber() { return TrophyWorldsParser.Data.map(row => row['WorldNumber']); }
    static GetIconexportpath() { return TrophyWorldsParser.Data.map(row => row['IconExportPath']); }
    static GetTiertrophythresholds() { return TrophyWorldsParser.Data.map(row => row['TierTrophyThresholds']); }
    static GetNametid() { return TrophyWorldsParser.Data.map(row => row['NameTID']); }
}

export default TrophyWorldsParser;
