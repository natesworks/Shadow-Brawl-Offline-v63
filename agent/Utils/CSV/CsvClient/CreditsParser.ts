class CreditsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        CreditsParser.Data = csvData;
    }
    static GetName() { return CreditsParser.Data.map(row => row['Name']); }
    static Get0() { return CreditsParser.Data.map(row => row['0']); }
}

export default CreditsParser;
