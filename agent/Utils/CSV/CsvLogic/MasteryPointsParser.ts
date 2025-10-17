class MasteryPointsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        MasteryPointsParser.Data = csvData;
    }
    static GetName() { return MasteryPointsParser.Data.map(row => row['Name']); }
    static GetType() { return MasteryPointsParser.Data.map(row => row['Type']); }
    static GetThreshold() { return MasteryPointsParser.Data.map(row => row['Threshold']); }
    static GetAmount() { return MasteryPointsParser.Data.map(row => row['Amount']); }
}

export default MasteryPointsParser;
