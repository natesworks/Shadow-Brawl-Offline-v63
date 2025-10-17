class BrawlerBoxRewardsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        BrawlerBoxRewardsParser.Data = csvData;
    }
    static GetName() { return BrawlerBoxRewardsParser.Data.map(row => row['Name']); }
    static GetTicketsindancerbrawlerbox() { return BrawlerBoxRewardsParser.Data.map(row => row['TicketsInDancerBrawlerBox']); }
    static GetTicketsinfurybrawlerbox() { return BrawlerBoxRewardsParser.Data.map(row => row['TicketsInFuryBrawlerBox']); }
    static GetTypename() { return BrawlerBoxRewardsParser.Data.map(row => row['TypeName']); }
    static GetSpecificbrawler() { return BrawlerBoxRewardsParser.Data.map(row => row['SpecificBrawler']); }
    static GetTypevalue() { return BrawlerBoxRewardsParser.Data.map(row => row['TypeValue']); }
    static GetInpremiumdraw() { return BrawlerBoxRewardsParser.Data.map(row => row['InPremiumDraw']); }
    static GetTypepricemin() { return BrawlerBoxRewardsParser.Data.map(row => row['TypePriceMin']); }
    static GetTypepricemax() { return BrawlerBoxRewardsParser.Data.map(row => row['TypePriceMax']); }
    static GetAmountmin() { return BrawlerBoxRewardsParser.Data.map(row => row['AmountMin']); }
    static GetAmountmax() { return BrawlerBoxRewardsParser.Data.map(row => row['AmountMax']); }
    static GetFallbacktypename() { return BrawlerBoxRewardsParser.Data.map(row => row['FallbackTypeName']); }
    static GetFallbackamount() { return BrawlerBoxRewardsParser.Data.map(row => row['FallbackAmount']); }
    static GetNoeventfallbacktypename() { return BrawlerBoxRewardsParser.Data.map(row => row['NoEventFallbackTypeName']); }
    static GetNoeventfallbackamount() { return BrawlerBoxRewardsParser.Data.map(row => row['NoEventFallbackAmount']); }
    static GetTierforvisualization() { return BrawlerBoxRewardsParser.Data.map(row => row['TierForVisualization']); }
    static GetSkinsinreward() { return BrawlerBoxRewardsParser.Data.map(row => row['SkinsInReward']); }
    static GetTicketsinskindraw() { return BrawlerBoxRewardsParser.Data.map(row => row['TicketsInSkinDraw']); }
    static GetSpraysinreward() { return BrawlerBoxRewardsParser.Data.map(row => row['SpraysInReward']); }
    static GetTicketsinspraydraw() { return BrawlerBoxRewardsParser.Data.map(row => row['TicketsInSprayDraw']); }
    static GetProfilepicsinreward() { return BrawlerBoxRewardsParser.Data.map(row => row['ProfilePicsInReward']); }
    static GetTicketsinprofilepicdraw() { return BrawlerBoxRewardsParser.Data.map(row => row['TicketsInProfilePicDraw']); }
    static GetPinsinreward() { return BrawlerBoxRewardsParser.Data.map(row => row['PinsInReward']); }
    static GetTicketsinpindraw() { return BrawlerBoxRewardsParser.Data.map(row => row['TicketsInPinDraw']); }
}

export default BrawlerBoxRewardsParser;
