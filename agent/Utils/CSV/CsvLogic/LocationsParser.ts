class LocationsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        LocationsParser.Data = csvData;
    }
    static GetName() { return LocationsParser.Data.map(row => row['Name']); }
    static GetDisabled() { return LocationsParser.Data.map(row => row['Disabled']); }
    static GetTid() { return LocationsParser.Data.map(row => row['TID']); }
    static GetLocationtheme() { return LocationsParser.Data.map(row => row['LocationTheme']); }
    static GetSupportingcampaignground() { return LocationsParser.Data.map(row => row['SupportingCampaignGround']); }
    static GetBanneroverrideswf() { return LocationsParser.Data.map(row => row['BannerOverrideSWF']); }
    static GetBanneroverrideexportname() { return LocationsParser.Data.map(row => row['BannerOverrideExportName']); }
    static GetGamemodevariation() { return LocationsParser.Data.map(row => row['GameModeVariation']); }
    static GetMap() { return LocationsParser.Data.map(row => row['Map']); }
    static GetCommunitycredit() { return LocationsParser.Data.map(row => row['CommunityCredit']); }
    static GetTraininggroundsenabled() { return LocationsParser.Data.map(row => row['TrainingGroundsEnabled']); }
    static GetRecommendedbrawler0() { return LocationsParser.Data.map(row => row['RecommendedBrawler0']); }
    static GetRecommendedbrawler1() { return LocationsParser.Data.map(row => row['RecommendedBrawler1']); }
    static GetRecommendedbrawler2() { return LocationsParser.Data.map(row => row['RecommendedBrawler2']); }
    static GetRecommendedbrawler3() { return LocationsParser.Data.map(row => row['RecommendedBrawler3']); }
    static GetRecommendedbrawler4() { return LocationsParser.Data.map(row => row['RecommendedBrawler4']); }
    static GetRecommendedbrawler5() { return LocationsParser.Data.map(row => row['RecommendedBrawler5']); }
    static GetRecommendedbrawler6() { return LocationsParser.Data.map(row => row['RecommendedBrawler6']); }
    static GetRecommendedbrawler7() { return LocationsParser.Data.map(row => row['RecommendedBrawler7']); }
    static GetRecommendedbrawler8() { return LocationsParser.Data.map(row => row['RecommendedBrawler8']); }
    static GetRecommendedbrawler9() { return LocationsParser.Data.map(row => row['RecommendedBrawler9']); }
}

export default LocationsParser;
