class StringReplacementParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        StringReplacementParser.Data = csvData;
    }
    static GetName() { return StringReplacementParser.Data.map(row => row['Name']); }
    static GetNeedle() { return StringReplacementParser.Data.map(row => row['Needle']); }
    static GetReplacement() { return StringReplacementParser.Data.map(row => row['Replacement']); }
    static GetMatchtype() { return StringReplacementParser.Data.map(row => row['MatchType']); }
    static GetUsage() { return StringReplacementParser.Data.map(row => row['Usage']); }
}

export default StringReplacementParser;
