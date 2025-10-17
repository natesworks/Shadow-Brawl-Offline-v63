class RecordLevelsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        RecordLevelsParser.Data = csvData;
    }
    static GetName() { return RecordLevelsParser.Data.map(row => row['Name']); }
    static GetCumulativerecordscore() { return RecordLevelsParser.Data.map(row => row['CumulativeRecordScore']); }
    static GetLevel() { return RecordLevelsParser.Data.map(row => row['Level']); }
    static GetEmblemswf() { return RecordLevelsParser.Data.map(row => row['EmblemSwf']); }
    static GetEmblemexportname() { return RecordLevelsParser.Data.map(row => row['EmblemExportName']); }
    static GetRewardtype() { return RecordLevelsParser.Data.map(row => row['RewardType']); }
    static GetReward() { return RecordLevelsParser.Data.map(row => row['Reward']); }
    static GetDontshow() { return RecordLevelsParser.Data.map(row => row['DontShow']); }
}

export default RecordLevelsParser;
