class LoginCalendarItemsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        LoginCalendarItemsParser.Data = csvData;
    }
    static GetName() { return LoginCalendarItemsParser.Data.map(row => row['Name']); }
    static GetRewardtid() { return LoginCalendarItemsParser.Data.map(row => row['RewardTID']); }
    static GetRewarddesctid() { return LoginCalendarItemsParser.Data.map(row => row['RewardDescTID']); }
    static GetRewardtypes() { return LoginCalendarItemsParser.Data.map(row => row['RewardTypes']); }
    static GetFilename() { return LoginCalendarItemsParser.Data.map(row => row['FileName']); }
    static GetPanelasset() { return LoginCalendarItemsParser.Data.map(row => row['PanelAsset']); }
    static GetHudasset() { return LoginCalendarItemsParser.Data.map(row => row['HudAsset']); }
    static GetChooserewardasset() { return LoginCalendarItemsParser.Data.map(row => row['ChooseRewardAsset']); }
    static GetFeaturedasset() { return LoginCalendarItemsParser.Data.map(row => row['FeaturedAsset']); }
    static GetRewardpanelframe() { return LoginCalendarItemsParser.Data.map(row => row['RewardPanelFrame']); }
    static GetFeaturedcontainerframe() { return LoginCalendarItemsParser.Data.map(row => row['FeaturedContainerFrame']); }
}

export default LoginCalendarItemsParser;
