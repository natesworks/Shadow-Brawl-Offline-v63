class MasteryRewardTypesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        MasteryRewardTypesParser.Data = csvData;
    }
    static GetName() { return MasteryRewardTypesParser.Data.map(row => row['Name']); }
    static GetDisabled() { return MasteryRewardTypesParser.Data.map(row => row['Disabled']); }
    static GetOffertype() { return MasteryRewardTypesParser.Data.map(row => row['OfferType']); }
    static GetRequiresdata() { return MasteryRewardTypesParser.Data.map(row => row['RequiresData']); }
    static GetForcedcount() { return MasteryRewardTypesParser.Data.map(row => row['ForcedCount']); }
    static GetRewarddatatype() { return MasteryRewardTypesParser.Data.map(row => row['RewardDataType']); }
    static GetFallbackrewardcoins() { return MasteryRewardTypesParser.Data.map(row => row['FallbackRewardCoins']); }
}

export default MasteryRewardTypesParser;
