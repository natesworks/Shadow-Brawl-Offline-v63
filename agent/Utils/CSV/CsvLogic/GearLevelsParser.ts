class GearLevelsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        GearLevelsParser.Data = csvData;
    }
    static GetName() { return GearLevelsParser.Data.map(row => row['Name']); }
    static GetGeartokens() { return GearLevelsParser.Data.map(row => row['GearTokens']); }
    static GetGearscrap() { return GearLevelsParser.Data.map(row => row['GearScrap']); }
}

export default GearLevelsParser;
