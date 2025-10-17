class ShopItemsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ShopItemsParser.Data = csvData;
    }
    static GetName() { return ShopItemsParser.Data.map(row => row['Name']); }
    static GetOffertype() { return ShopItemsParser.Data.map(row => row['OfferType']); }
    static GetAccepttooffers() { return ShopItemsParser.Data.map(row => row['AcceptToOffers']); }
    static GetAccepttochallengerewards() { return ShopItemsParser.Data.map(row => row['AcceptToChallengeRewards']); }
    static GetAccepttochallengefallbackrewards() { return ShopItemsParser.Data.map(row => row['AcceptToChallengeFallbackRewards']); }
    static GetAccepttoquestrewards() { return ShopItemsParser.Data.map(row => row['AcceptToQuestRewards']); }
    static GetAccepttoquestfallbackrewards() { return ShopItemsParser.Data.map(row => row['AcceptToQuestFallbackRewards']); }
    static GetIconframenumber() { return ShopItemsParser.Data.map(row => row['IconFrameNumber']); }
    static GetMaxresourceperframe() { return ShopItemsParser.Data.map(row => row['MaxResourcePerFrame']); }
    static GetShopitemasset() { return ShopItemsParser.Data.map(row => row['ShopItemAsset']); }
    static GetShopitemassetbig() { return ShopItemsParser.Data.map(row => row['ShopItemAssetBig']); }
    static GetPopupitemasset() { return ShopItemsParser.Data.map(row => row['PopupItemAsset']); }
    static GetPopupitemassethighlight() { return ShopItemsParser.Data.map(row => row['PopupItemAssetHighlight']); }
    static GetMiniofferasset() { return ShopItemsParser.Data.map(row => row['MiniOfferAsset']); }
    static GetSeparatedsectionofferasset() { return ShopItemsParser.Data.map(row => row['SeparatedSectionOfferAsset']); }
    static GetSeparatedsectionteaseasset() { return ShopItemsParser.Data.map(row => row['SeparatedSectionTeaseAsset']); }
    static GetSeasonaleventofferasset() { return ShopItemsParser.Data.map(row => row['SeasonalEventOfferAsset']); }
    static GetLegendaryofferasset() { return ShopItemsParser.Data.map(row => row['LegendaryOfferAsset']); }
    static GetClubshopitemasset() { return ShopItemsParser.Data.map(row => row['ClubShopItemAsset']); }
    static GetOfferassetsolo() { return ShopItemsParser.Data.map(row => row['OfferAssetSolo']); }
    static GetOfferassethalf() { return ShopItemsParser.Data.map(row => row['OfferAssetHalf']); }
    static GetOfferassetquarter() { return ShopItemsParser.Data.map(row => row['OfferAssetQuarter']); }
    static GetOfferassetherolayout() { return ShopItemsParser.Data.map(row => row['OfferAssetHeroLayout']); }
    static GetOfferassetsolohighlight() { return ShopItemsParser.Data.map(row => row['OfferAssetSoloHighlight']); }
    static GetOfferassethalfhighlight() { return ShopItemsParser.Data.map(row => row['OfferAssetHalfHighlight']); }
    static GetOfferassetquarterhighlight() { return ShopItemsParser.Data.map(row => row['OfferAssetQuarterHighlight']); }
    static GetOfferassetherolayouthighlight() { return ShopItemsParser.Data.map(row => row['OfferAssetHeroLayoutHighlight']); }
    static GetSoloofferbgframes() { return ShopItemsParser.Data.map(row => row['SoloOfferBgFrames']); }
    static GetBrawlpassassetpaid() { return ShopItemsParser.Data.map(row => row['BrawlPassAssetPaid']); }
    static GetBrawlpassassetfree() { return ShopItemsParser.Data.map(row => row['BrawlPassAssetFree']); }
    static GetBrawlpassassetplus() { return ShopItemsParser.Data.map(row => row['BrawlPassAssetPlus']); }
    static GetMasterytrackasset() { return ShopItemsParser.Data.map(row => row['MasteryTrackAsset']); }
    static GetMasterysmallrewardasset() { return ShopItemsParser.Data.map(row => row['MasterySmallRewardAsset']); }
    static GetTrophyrankrewardprofile() { return ShopItemsParser.Data.map(row => row['TrophyRankRewardProfile']); }
    static GetSamesizeforcollected() { return ShopItemsParser.Data.map(row => row['SameSizeForCollected']); }
    static GetTrophyrewardmediumthreshold() { return ShopItemsParser.Data.map(row => row['TrophyRewardMediumThreshold']); }
    static GetTrophyrewardlargethreshold() { return ShopItemsParser.Data.map(row => row['TrophyRewardLargeThreshold']); }
    static GetTrophyrankrewardtiny() { return ShopItemsParser.Data.map(row => row['TrophyRankRewardTiny']); }
    static GetTrophyrankrewardsmall() { return ShopItemsParser.Data.map(row => row['TrophyRankRewardSmall']); }
    static GetTrophyrankrewardmedium() { return ShopItemsParser.Data.map(row => row['TrophyRankRewardMedium']); }
    static GetTrophyrankrewardlarge() { return ShopItemsParser.Data.map(row => row['TrophyRankRewardLarge']); }
    static GetTrophyworldreward() { return ShopItemsParser.Data.map(row => row['TrophyWorldReward']); }
    static GetTrophyworldiconframenumber() { return ShopItemsParser.Data.map(row => row['TrophyWorldIconFrameNumber']); }
    static GetTrophyworldmaxresourceperframe() { return ShopItemsParser.Data.map(row => row['TrophyWorldMaxResourcePerFrame']); }
    static GetChainofferminiitemsmall() { return ShopItemsParser.Data.map(row => row['ChainOfferMiniItemSmall']); }
    static GetChainofferminiitemmedium() { return ShopItemsParser.Data.map(row => row['ChainOfferMiniItemMedium']); }
    static GetChainofferminiitemlarge() { return ShopItemsParser.Data.map(row => row['ChainOfferMiniItemLarge']); }
    static GetRankedrewardasset() { return ShopItemsParser.Data.map(row => row['RankedRewardAsset']); }
    static GetRankedgoalasset() { return ShopItemsParser.Data.map(row => row['RankedGoalAsset']); }
    static GetRankedgoalquestasset() { return ShopItemsParser.Data.map(row => row['RankedGoalQuestAsset']); }
    static GetClubcollabasset() { return ShopItemsParser.Data.map(row => row['ClubCollabAsset']); }
    static GetRewarddesctid() { return ShopItemsParser.Data.map(row => row['RewardDescTID']); }
    static GetChallengerewardframe() { return ShopItemsParser.Data.map(row => row['ChallengeRewardFrame']); }
    static GetChallengerewardasset() { return ShopItemsParser.Data.map(row => row['ChallengeRewardAsset']); }
    static GetRecordspopuprewards() { return ShopItemsParser.Data.map(row => row['RecordsPopupRewards']); }
}

export default ShopItemsParser;
