class MilestonesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        MilestonesParser.Data = csvData;
    }
    static GetName() { return MilestonesParser.Data.map(row => row['Name']); }
    static GetType() { return MilestonesParser.Data.map(row => row['Type']); }
    static GetIndex() { return MilestonesParser.Data.map(row => row['Index']); }
    static GetProgressstart() { return MilestonesParser.Data.map(row => row['ProgressStart']); }
    static GetProgress() { return MilestonesParser.Data.map(row => row['Progress']); }
    static GetLeague() { return MilestonesParser.Data.map(row => row['League']); }
    static GetTier() { return MilestonesParser.Data.map(row => row['Tier']); }
    static GetSeason() { return MilestonesParser.Data.map(row => row['Season']); }
    static GetHeropowerunlock() { return MilestonesParser.Data.map(row => row['HeroPowerUnlock']); }
    static GetPrimarylvluprewardtype() { return MilestonesParser.Data.map(row => row['PrimaryLvlUpRewardType']); }
    static GetPrimarylvluprewardcount() { return MilestonesParser.Data.map(row => row['PrimaryLvlUpRewardCount']); }
    static GetPrimarylvluprewardextradata() { return MilestonesParser.Data.map(row => row['PrimaryLvlUpRewardExtraData']); }
    static GetPrimarylvluprewarddata() { return MilestonesParser.Data.map(row => row['PrimaryLvlUpRewardData']); }
    static GetSecondarylvluprewardtype() { return MilestonesParser.Data.map(row => row['SecondaryLvlUpRewardType']); }
    static GetSecondarylvluprewardcount() { return MilestonesParser.Data.map(row => row['SecondaryLvlUpRewardCount']); }
    static GetSecondarylvluprewardextradata() { return MilestonesParser.Data.map(row => row['SecondaryLvlUpRewardExtraData']); }
    static GetSecondarylvluprewarddata() { return MilestonesParser.Data.map(row => row['SecondaryLvlUpRewardData']); }
    static GetDependsonindex() { return MilestonesParser.Data.map(row => row['DependsOnIndex']); }
    static GetRankassetframe() { return MilestonesParser.Data.map(row => row['RankAssetFrame']); }
    static GetRanknumbervalue() { return MilestonesParser.Data.map(row => row['RankNumberValue']); }
    static GetRankfaceframe() { return MilestonesParser.Data.map(row => row['RankFaceFrame']); }
    static GetRankhextextcolor() { return MilestonesParser.Data.map(row => row['RankHexTextColor']); }
}

export default MilestonesParser;
