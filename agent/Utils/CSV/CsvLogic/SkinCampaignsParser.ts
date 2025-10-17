class SkinCampaignsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        SkinCampaignsParser.Data = csvData;
    }
    static GetName() { return SkinCampaignsParser.Data.map(row => row['Name']); }
    static GetNametid() { return SkinCampaignsParser.Data.map(row => row['NameTID']); }
    static GetInfotid() { return SkinCampaignsParser.Data.map(row => row['InfoTID']); }
    static GetBgitemname() { return SkinCampaignsParser.Data.map(row => row['BgItemName']); }
    static GetBgofferpopup() { return SkinCampaignsParser.Data.map(row => row['BgOfferPopup']); }
    static GetSkinbuyrequiresexclusiveoption() { return SkinCampaignsParser.Data.map(row => row['SkinBuyRequiresExclusiveOption']); }
    static GetEmotebundlename() { return SkinCampaignsParser.Data.map(row => row['EmoteBundleName']); }
    static GetCampaigniconexportname() { return SkinCampaignsParser.Data.map(row => row['CampaignIconExportName']); }
    static GetDisabledfromcatalog() { return SkinCampaignsParser.Data.map(row => row['DisabledFromCatalog']); }
    static GetShowincatalogcollectionssection() { return SkinCampaignsParser.Data.map(row => row['ShowInCatalogCollectionsSection']); }
    static GetCatalogsortingorder() { return SkinCampaignsParser.Data.map(row => row['CatalogSortingOrder']); }
    static GetBundledundercatalogcategory() { return SkinCampaignsParser.Data.map(row => row['BundledUnderCatalogCategory']); }
    static GetCatalognameoverridetid() { return SkinCampaignsParser.Data.map(row => row['CatalogNameOverrideTID']); }
    static GetCatalogdescriptiontid() { return SkinCampaignsParser.Data.map(row => row['CatalogDescriptionTID']); }
    static GetUsesecondcampaing() { return SkinCampaignsParser.Data.map(row => row['UseSecondCampaing']); }
}

export default SkinCampaignsParser;
