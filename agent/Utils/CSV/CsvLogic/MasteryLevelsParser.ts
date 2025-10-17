class MasteryLevelsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        MasteryLevelsParser.Data = csvData;
    }
    static GetName() { return MasteryLevelsParser.Data.map(row => row['Name']); }
    static GetLevel() { return MasteryLevelsParser.Data.map(row => row['Level']); }
    static GetTotalpointsthreshold() { return MasteryLevelsParser.Data.map(row => row['TotalPointsThreshold']); }
    static GetRewardcountCommon() { return MasteryLevelsParser.Data.map(row => row['RewardCount_Common']); }
    static GetRewardtypeCommon() { return MasteryLevelsParser.Data.map(row => row['RewardType_Common']); }
    static GetRewardcountRare() { return MasteryLevelsParser.Data.map(row => row['RewardCount_Rare']); }
    static GetRewardtypeRare() { return MasteryLevelsParser.Data.map(row => row['RewardType_Rare']); }
    static GetRewardcountSuperrare() { return MasteryLevelsParser.Data.map(row => row['RewardCount_SuperRare']); }
    static GetRewardtypeSuperrare() { return MasteryLevelsParser.Data.map(row => row['RewardType_SuperRare']); }
    static GetRewardcountEpic() { return MasteryLevelsParser.Data.map(row => row['RewardCount_Epic']); }
    static GetRewardtypeEpic() { return MasteryLevelsParser.Data.map(row => row['RewardType_Epic']); }
    static GetRewardcountMythic() { return MasteryLevelsParser.Data.map(row => row['RewardCount_Mythic']); }
    static GetRewardtypeMythic() { return MasteryLevelsParser.Data.map(row => row['RewardType_Mythic']); }
    static GetRewardcountLegendary() { return MasteryLevelsParser.Data.map(row => row['RewardCount_Legendary']); }
    static GetRewardtypeLegendary() { return MasteryLevelsParser.Data.map(row => row['RewardType_Legendary']); }
    static GetRewardcountChromatic() { return MasteryLevelsParser.Data.map(row => row['RewardCount_Chromatic']); }
    static GetRewardtypeChromatic() { return MasteryLevelsParser.Data.map(row => row['RewardType_Chromatic']); }
    static GetRewardcountUltralegendary() { return MasteryLevelsParser.Data.map(row => row['RewardCount_UltraLegendary']); }
    static GetRewardtypeUltralegendary() { return MasteryLevelsParser.Data.map(row => row['RewardType_UltraLegendary']); }
    static GetFrameindex() { return MasteryLevelsParser.Data.map(row => row['FrameIndex']); }
    static GetTiertid() { return MasteryLevelsParser.Data.map(row => row['TierTID']); }
    static GetLevelwithtiertid() { return MasteryLevelsParser.Data.map(row => row['LevelWithTierTID']); }
    static GetTierhexcolor() { return MasteryLevelsParser.Data.map(row => row['TierHexColor']); }
    static GetTotalpointsthresholdCustom1() { return MasteryLevelsParser.Data.map(row => row['TotalPointsThreshold_Custom1']); }
    static GetRewardcountCustom1() { return MasteryLevelsParser.Data.map(row => row['RewardCount_Custom1']); }
    static GetRewardtypeCustom1() { return MasteryLevelsParser.Data.map(row => row['RewardType_Custom1']); }
}

export default MasteryLevelsParser;
