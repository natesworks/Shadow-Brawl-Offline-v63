class GlobalsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        GlobalsParser.Data = csvData;
    }
    static GetName() { return GlobalsParser.Data.map(row => row['Name']); }
    static GetNumbervalue() { return GlobalsParser.Data.map(row => row['NumberValue']); }
    static GetBooleanvalue() { return GlobalsParser.Data.map(row => row['BooleanValue']); }
    static GetTextvalue() { return GlobalsParser.Data.map(row => row['TextValue']); }
    static GetStringarray() { return GlobalsParser.Data.map(row => row['StringArray']); }
    static GetNumberarray() { return GlobalsParser.Data.map(row => row['NumberArray']); }
}

export default GlobalsParser;
