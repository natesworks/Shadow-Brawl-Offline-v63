class RegionsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        RegionsParser.Data = csvData;
    }
    static GetName() { return RegionsParser.Data.map(row => row['Name']); }
    static GetTid() { return RegionsParser.Data.map(row => row['TID']); }
    static GetDisplayname() { return RegionsParser.Data.map(row => row['DisplayName']); }
    static GetIscountry() { return RegionsParser.Data.map(row => row['IsCountry']); }
    static GetAgelimitoverride() { return RegionsParser.Data.map(row => row['AgeLimitOverride']); }
    static GetForcescidloginfornewplayers() { return RegionsParser.Data.map(row => row['ForceScidLoginForNewPlayers']); }
}

export default RegionsParser;
