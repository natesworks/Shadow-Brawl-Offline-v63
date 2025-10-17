class ContestTypesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ContestTypesParser.Data = csvData;
    }
    static GetName() { return ContestTypesParser.Data.map(row => row['Name']); }
    static GetCollab() { return ContestTypesParser.Data.map(row => row['Collab']); }
    static GetReskinassetid() { return ContestTypesParser.Data.map(row => row['ReskinAssetId']); }
    static GetRewardtype() { return ContestTypesParser.Data.map(row => row['RewardType']); }
    static GetLocationcategoryexportname() { return ContestTypesParser.Data.map(row => row['LocationCategoryExportName']); }
    static GetTicketiconexportname() { return ContestTypesParser.Data.map(row => row['TicketIconExportName']); }
    static GetRewardscreenexportname() { return ContestTypesParser.Data.map(row => row['RewardScreenExportName']); }
    static GetScoreiconexportname() { return ContestTypesParser.Data.map(row => row['ScoreIconExportName']); }
    static GetEventselectiontooltipexportname() { return ContestTypesParser.Data.map(row => row['EventSelectionTooltipExportName']); }
    static GetSelectablelocationcount() { return ContestTypesParser.Data.map(row => row['SelectableLocationCount']); }
    static GetContestlocationselectionpopupexportname() { return ContestTypesParser.Data.map(row => row['ContestLocationSelectionPopupExportName']); }
    static GetWinbonusgradient() { return ContestTypesParser.Data.map(row => row['WinBonusGradient']); }
    static GetRewardshopitem() { return ContestTypesParser.Data.map(row => row['RewardShopItem']); }
    static GetRewardclaimbuttoninstancename() { return ContestTypesParser.Data.map(row => row['RewardClaimButtonInstanceName']); }
    static GetOfflinechronosasset() { return ContestTypesParser.Data.map(row => row['OfflineChronosAsset']); }
}

export default ContestTypesParser;
