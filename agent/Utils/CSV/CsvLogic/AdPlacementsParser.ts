class AdPlacementsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        AdPlacementsParser.Data = csvData;
    }
    static GetName() { return AdPlacementsParser.Data.map(row => row['Name']); }
    static GetPlacementtype() { return AdPlacementsParser.Data.map(row => row['PlacementType']); }
    static GetDisabled() { return AdPlacementsParser.Data.map(row => row['Disabled']); }
}

export default AdPlacementsParser;
