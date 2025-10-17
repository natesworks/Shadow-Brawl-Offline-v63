class RecordsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        RecordsParser.Data = csvData;
    }
    static GetName() { return RecordsParser.Data.map(row => row['Name']); }
    static GetDisabled() { return RecordsParser.Data.map(row => row['Disabled']); }
    static GetType() { return RecordsParser.Data.map(row => row['Type']); }
    static GetIntparam() { return RecordsParser.Data.map(row => row['IntParam']); }
    static GetGameplaygoal() { return RecordsParser.Data.map(row => row['GameplayGoal']); }
    static GetTimespermatch() { return RecordsParser.Data.map(row => row['TimesPerMatch']); }
    static GetTickscooldown() { return RecordsParser.Data.map(row => row['TicksCooldown']); }
    static GetTracker() { return RecordsParser.Data.map(row => row['Tracker']); }
    static GetTrackerintparam() { return RecordsParser.Data.map(row => row['TrackerIntParam']); }
    static GetTrackervalue() { return RecordsParser.Data.map(row => row['TrackerValue']); }
    static GetRewardpoints() { return RecordsParser.Data.map(row => row['RewardPoints']); }
    static GetRewardtype() { return RecordsParser.Data.map(row => row['RewardType']); }
    static GetReward() { return RecordsParser.Data.map(row => row['Reward']); }
    static GetFallbackcoins() { return RecordsParser.Data.map(row => row['FallbackCoins']); }
    static GetTitletid() { return RecordsParser.Data.map(row => row['TitleTID']); }
    static GetDescriptiontid() { return RecordsParser.Data.map(row => row['DescriptionTID']); }
    static GetTargethero() { return RecordsParser.Data.map(row => row['TargetHero']); }
    static GetTargetgamemodes() { return RecordsParser.Data.map(row => row['TargetGameModes']); }
    static GetPrevioustier() { return RecordsParser.Data.map(row => row['PreviousTier']); }
    static GetGamemodeicon() { return RecordsParser.Data.map(row => row['GameModeIcon']); }
    static GetSortingorder() { return RecordsParser.Data.map(row => row['SortingOrder']); }
    static GetGroupings() { return RecordsParser.Data.map(row => row['Groupings']); }
    static GetNomodifieronly() { return RecordsParser.Data.map(row => row['NoModifierOnly']); }
    static GetIconasset() { return RecordsParser.Data.map(row => row['IconAsset']); }
    static GetIconscalepercent() { return RecordsParser.Data.map(row => row['IconScalePercent']); }
}

export default RecordsParser;
