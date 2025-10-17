class MasteryHeroConfsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        MasteryHeroConfsParser.Data = csvData;
    }
    static GetName() { return MasteryHeroConfsParser.Data.map(row => row['Name']); }
    static GetRewardemotes() { return MasteryHeroConfsParser.Data.map(row => row['RewardEmotes']); }
    static GetRewardplayericons() { return MasteryHeroConfsParser.Data.map(row => row['RewardPlayerIcons']); }
    static GetRewardtitles() { return MasteryHeroConfsParser.Data.map(row => row['RewardTitles']); }
    static GetRewardsprays() { return MasteryHeroConfsParser.Data.map(row => row['RewardSprays']); }
    static GetMasteryiconfile() { return MasteryHeroConfsParser.Data.map(row => row['MasteryIconFile']); }
    static GetMasteryiconexportname() { return MasteryHeroConfsParser.Data.map(row => row['MasteryIconExportName']); }
    static GetCustomtrack() { return MasteryHeroConfsParser.Data.map(row => row['CustomTrack']); }
    static GetVisualcomponenttypes() { return MasteryHeroConfsParser.Data.map(row => row['VisualComponentTypes']); }
    static GetVisualcomponentnames() { return MasteryHeroConfsParser.Data.map(row => row['VisualComponentNames']); }
}

export default MasteryHeroConfsParser;
