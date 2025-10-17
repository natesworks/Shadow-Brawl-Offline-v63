class MapTemplatesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        MapTemplatesParser.Data = csvData;
    }
    static GetMap() { return MapTemplatesParser.Data.map(row => row['Map']); }
    static GetData() { return MapTemplatesParser.Data.map(row => row['Data']); }
    static GetMetadata() { return MapTemplatesParser.Data.map(row => row['MetaData']); }
}

export default MapTemplatesParser;
