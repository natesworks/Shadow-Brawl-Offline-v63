class ClientGlobalsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ClientGlobalsParser.Data = csvData;
    }
    static GetName() { return ClientGlobalsParser.Data.map(row => row['Name']); }
    static GetNumbervalue() { return ClientGlobalsParser.Data.map(row => row['NumberValue']); }
    static GetBooleanvalue() { return ClientGlobalsParser.Data.map(row => row['BooleanValue']); }
    static GetTextvalue() { return ClientGlobalsParser.Data.map(row => row['TextValue']); }
    static GetNumberarray() { return ClientGlobalsParser.Data.map(row => row['NumberArray']); }
    static GetStringarray() { return ClientGlobalsParser.Data.map(row => row['StringArray']); }
    static GetAltstringarray() { return ClientGlobalsParser.Data.map(row => row['AltStringArray']); }
}

export default ClientGlobalsParser;
