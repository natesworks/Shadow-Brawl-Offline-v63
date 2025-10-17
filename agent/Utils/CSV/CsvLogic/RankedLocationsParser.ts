class RankedLocationsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        RankedLocationsParser.Data = csvData;
    }
    static GetName() { return RankedLocationsParser.Data.map(row => row['Name']); }
    static GetDisabled() { return RankedLocationsParser.Data.map(row => row['Disabled']); }
}

export default RankedLocationsParser;
