class PlayerThumbnailsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        PlayerThumbnailsParser.Data = csvData;
    }
    static GetName() { return PlayerThumbnailsParser.Data.map(row => row['Name']); }
    static GetDisabled() { return PlayerThumbnailsParser.Data.map(row => row['Disabled']); }
    static GetDisabledcn() { return PlayerThumbnailsParser.Data.map(row => row['DisabledCN']); }
    static GetLegacyexplevellimit() { return PlayerThumbnailsParser.Data.map(row => row['LegacyExpLevelLimit']); }
    static GetRequiredtotaltrophies() { return PlayerThumbnailsParser.Data.map(row => row['RequiredTotalTrophies']); }
    static GetRequiredhero() { return PlayerThumbnailsParser.Data.map(row => row['RequiredHero']); }
    static GetIconswf() { return PlayerThumbnailsParser.Data.map(row => row['IconSWF']); }
    static GetIconexportname() { return PlayerThumbnailsParser.Data.map(row => row['IconExportName']); }
    static GetSortorder() { return PlayerThumbnailsParser.Data.map(row => row['SortOrder']); }
    static GetIsreward() { return PlayerThumbnailsParser.Data.map(row => row['IsReward']); }
    static GetIsavailableforoffers() { return PlayerThumbnailsParser.Data.map(row => row['IsAvailableForOffers']); }
    static GetLockedforchronos() { return PlayerThumbnailsParser.Data.map(row => row['LockedForChronos']); }
    static GetPricebling() { return PlayerThumbnailsParser.Data.map(row => row['PriceBling']); }
    static GetPricegems() { return PlayerThumbnailsParser.Data.map(row => row['PriceGems']); }
    static GetDisablecatalogrelease() { return PlayerThumbnailsParser.Data.map(row => row['DisableCatalogRelease']); }
    static GetHideincatalogwhennotowned() { return PlayerThumbnailsParser.Data.map(row => row['HideInCatalogWhenNotOwned']); }
    static GetCatalognewdaysadjustment() { return PlayerThumbnailsParser.Data.map(row => row['CatalogNewDaysAdjustment']); }
    static GetCatalogprerequirementskin() { return PlayerThumbnailsParser.Data.map(row => row['CatalogPreRequirementSkin']); }
    static GetGiveonskinunlock() { return PlayerThumbnailsParser.Data.map(row => row['GiveOnSkinUnlock']); }
    static GetNotincatalogtid() { return PlayerThumbnailsParser.Data.map(row => row['NotInCatalogTID']); }
    static GetExtracatalogcampaign() { return PlayerThumbnailsParser.Data.map(row => row['ExtraCatalogCampaign']); }
    static GetExtracataloghero() { return PlayerThumbnailsParser.Data.map(row => row['ExtraCatalogHero']); }
    static GetHidefromcatalogmaincategory() { return PlayerThumbnailsParser.Data.map(row => row['HideFromCatalogMainCategory']); }
    static GetUnlockedbyfame() { return PlayerThumbnailsParser.Data.map(row => row['UnlockedByFame']); }
}

export default PlayerThumbnailsParser;
