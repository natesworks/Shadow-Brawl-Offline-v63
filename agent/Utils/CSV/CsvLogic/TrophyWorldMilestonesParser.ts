class TrophyWorldMilestonesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        TrophyWorldMilestonesParser.Data = csvData;
    }
    static GetName() { return TrophyWorldMilestonesParser.Data.map(row => row['Name']); }
    static GetIndex() { return TrophyWorldMilestonesParser.Data.map(row => row['Index']); }
    static GetTrophycount() { return TrophyWorldMilestonesParser.Data.map(row => row['TrophyCount']); }
    static GetRewardtype() { return TrophyWorldMilestonesParser.Data.map(row => row['RewardType']); }
    static GetRewardcount() { return TrophyWorldMilestonesParser.Data.map(row => row['RewardCount']); }
    static GetRewardextradata() { return TrophyWorldMilestonesParser.Data.map(row => row['RewardExtraData']); }
    static GetRewarddata() { return TrophyWorldMilestonesParser.Data.map(row => row['RewardData']); }
    static GetFallbackrewardtype() { return TrophyWorldMilestonesParser.Data.map(row => row['FallbackRewardType']); }
    static GetFallbackrewardcount() { return TrophyWorldMilestonesParser.Data.map(row => row['FallbackRewardCount']); }
    static GetFallbackrewardextradata() { return TrophyWorldMilestonesParser.Data.map(row => row['FallbackRewardExtraData']); }
    static GetFallbackrewarddata() { return TrophyWorldMilestonesParser.Data.map(row => row['FallbackRewardData']); }
}

export default TrophyWorldMilestonesParser;
