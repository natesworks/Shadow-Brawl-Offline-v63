class ChronosAssetIdsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ChronosAssetIdsParser.Data = csvData;
    }
    static GetName() { return ChronosAssetIdsParser.Data.map(row => row['Name']); }
    static GetDisabled() { return ChronosAssetIdsParser.Data.map(row => row['Disabled']); }
    static GetValidformat() { return ChronosAssetIdsParser.Data.map(row => row['ValidFormat']); }
}

export default ChronosAssetIdsParser;
