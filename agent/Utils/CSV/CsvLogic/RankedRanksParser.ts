class RankedRanksParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        RankedRanksParser.Data = csvData;
    }
    static GetName() { return RankedRanksParser.Data.map(row => row['Name']); }
    static GetRank() { return RankedRanksParser.Data.map(row => row['Rank']); }
    static GetMinelo() { return RankedRanksParser.Data.map(row => row['MinELO']); }
    static GetMaxelo() { return RankedRanksParser.Data.map(row => row['MaxELO']); }
    static GetRequiredbrawlerlevel() { return RankedRanksParser.Data.map(row => row['RequiredBrawlerLevel']); }
    static GetRequiredbrawlercount() { return RankedRanksParser.Data.map(row => row['RequiredBrawlerCount']); }
    static GetPointsrewardamount() { return RankedRanksParser.Data.map(row => row['PointsRewardAmount']); }
    static GetRandomrewardcontainer() { return RankedRanksParser.Data.map(row => row['RandomRewardContainer']); }
    static GetTid() { return RankedRanksParser.Data.map(row => row['TID']); }
    static GetHexcolor() { return RankedRanksParser.Data.map(row => row['HexColor']); }
    static GetFramelabel() { return RankedRanksParser.Data.map(row => row['FrameLabel']); }
    static GetRankicontextfield() { return RankedRanksParser.Data.map(row => row['RankIconTextField']); }
    static GetRankicontid() { return RankedRanksParser.Data.map(row => row['RankIconTID']); }
    static GetCompetitivegroup() { return RankedRanksParser.Data.map(row => row['CompetitiveGroup']); }
    static GetCompetitiveicon() { return RankedRanksParser.Data.map(row => row['CompetitiveIcon']); }
    static GetCompetitivebackground() { return RankedRanksParser.Data.map(row => row['CompetitiveBackground']); }
    static GetHasframereward() { return RankedRanksParser.Data.map(row => row['HasFrameReward']); }
    static GetSound() { return RankedRanksParser.Data.map(row => row['Sound']); }
    static GetShowglobalrank() { return RankedRanksParser.Data.map(row => row['ShowGlobalRank']); }
    static GetFormattooltipcontext() { return RankedRanksParser.Data.map(row => row['FormatTooltipContext']); }
    static GetFramelabeltooltip() { return RankedRanksParser.Data.map(row => row['FrameLabelTooltip']); }
    static GetTidtooltip() { return RankedRanksParser.Data.map(row => row['TIDTooltip']); }
}

export default RankedRanksParser;
