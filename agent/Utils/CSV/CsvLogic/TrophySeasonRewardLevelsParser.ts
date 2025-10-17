class TrophySeasonRewardLevelsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        TrophySeasonRewardLevelsParser.Data = csvData;
    }
    static GetName() { return TrophySeasonRewardLevelsParser.Data.map(row => row['Name']); }
    static GetRewardcontainer() { return TrophySeasonRewardLevelsParser.Data.map(row => row['RewardContainer']); }
    static GetDrawsinstancename() { return TrophySeasonRewardLevelsParser.Data.map(row => row['DrawsInstanceName']); }
    static GetSeasonendscreenframeindex() { return TrophySeasonRewardLevelsParser.Data.map(row => row['SeasonEndScreenFrameIndex']); }
    static GetSeasonendscreenboxlevel() { return TrophySeasonRewardLevelsParser.Data.map(row => row['SeasonEndScreenBoxLevel']); }
    static GetRewardingtid() { return TrophySeasonRewardLevelsParser.Data.map(row => row['RewardingTID']); }
}

export default TrophySeasonRewardLevelsParser;
