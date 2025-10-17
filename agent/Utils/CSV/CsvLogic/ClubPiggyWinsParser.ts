class ClubPiggyWinsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ClubPiggyWinsParser.Data = csvData;
    }
    static GetName() { return ClubPiggyWinsParser.Data.map(row => row['Name']); }
    static GetWintracktype() { return ClubPiggyWinsParser.Data.map(row => row['WinTrackType']); }
    static GetCumulativewins() { return ClubPiggyWinsParser.Data.map(row => row['CumulativeWins']); }
    static GetMainmilestone() { return ClubPiggyWinsParser.Data.map(row => row['MainMilestone']); }
    static GetLevel() { return ClubPiggyWinsParser.Data.map(row => row['Level']); }
    static GetCumulativerewardstardrops() { return ClubPiggyWinsParser.Data.map(row => row['CumulativeRewardStarDrops']); }
    static GetCumulativerewardcoins() { return ClubPiggyWinsParser.Data.map(row => row['CumulativeRewardCoins']); }
    static GetCumulativerewardpowerpoints() { return ClubPiggyWinsParser.Data.map(row => row['CumulativeRewardPowerPoints']); }
    static GetCumulativerewardbling() { return ClubPiggyWinsParser.Data.map(row => row['CumulativeRewardBling']); }
    static GetExtrarewardtype() { return ClubPiggyWinsParser.Data.map(row => row['ExtraRewardType']); }
    static GetExtrarewardname() { return ClubPiggyWinsParser.Data.map(row => row['ExtraRewardName']); }
}

export default ClubPiggyWinsParser;
