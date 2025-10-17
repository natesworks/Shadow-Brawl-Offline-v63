class MapsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        MapsParser.Data = csvData;
    }
    static GetMap() { return MapsParser.Data.map(row => row['Map']); }
    static GetData() { return MapsParser.Data.map(row => row['Data']); }
    static GetMetadata() { return MapsParser.Data.map(row => row['MetaData']); }
}

export default MapsParser;
