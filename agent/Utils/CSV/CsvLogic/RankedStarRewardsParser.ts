class RankedStarRewardsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        RankedStarRewardsParser.Data = csvData;
    }
    static GetName() { return RankedStarRewardsParser.Data.map(row => row['Name']); }
    static GetPowerleagueseasonid() { return RankedStarRewardsParser.Data.map(row => row['PowerLeagueSeasonId']); }
    static GetSkinsinrankedstar() { return RankedStarRewardsParser.Data.map(row => row['SkinsInRankedStar']); }
    static GetTicketsinskindraw() { return RankedStarRewardsParser.Data.map(row => row['TicketsInSkinDraw']); }
    static GetSpraysinrankedstar() { return RankedStarRewardsParser.Data.map(row => row['SpraysInRankedStar']); }
    static GetTicketsinspraydraw() { return RankedStarRewardsParser.Data.map(row => row['TicketsInSprayDraw']); }
    static GetProfilepicsinrankedstar() { return RankedStarRewardsParser.Data.map(row => row['ProfilePicsInRankedStar']); }
    static GetTicketsinprofilepicdraw() { return RankedStarRewardsParser.Data.map(row => row['TicketsInProfilePicDraw']); }
}

export default RankedStarRewardsParser;
