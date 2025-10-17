class BattleFeatsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        BattleFeatsParser.Data = csvData;
    }
    static GetName() { return BattleFeatsParser.Data.map(row => row['Name']); }
    static GetTid() { return BattleFeatsParser.Data.map(row => row['TID']); }
    static GetGradient() { return BattleFeatsParser.Data.map(row => row['Gradient']); }
}

export default BattleFeatsParser;
