class PlayerMapEnvironmentsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        PlayerMapEnvironmentsParser.Data = csvData;
    }
    static GetName() { return PlayerMapEnvironmentsParser.Data.map(row => row['Name']); }
    static GetDisabled() { return PlayerMapEnvironmentsParser.Data.map(row => row['Disabled']); }
    static GetTid() { return PlayerMapEnvironmentsParser.Data.map(row => row['TID']); }
    static GetGamemodevariations() { return PlayerMapEnvironmentsParser.Data.map(row => row['GameModeVariations']); }
    static GetLocationthemes() { return PlayerMapEnvironmentsParser.Data.map(row => row['LocationThemes']); }
    static GetMaptemplates() { return PlayerMapEnvironmentsParser.Data.map(row => row['MapTemplates']); }
}

export default PlayerMapEnvironmentsParser;
