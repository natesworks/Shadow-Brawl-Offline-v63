class ShopStyleSetsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ShopStyleSetsParser.Data = csvData;
    }
    static GetName() { return ShopStyleSetsParser.Data.map(row => row['Name']); }
    static GetDisabled() { return ShopStyleSetsParser.Data.map(row => row['Disabled']); }
    static GetStarterpacklike() { return ShopStyleSetsParser.Data.map(row => row['StarterPackLike']); }
    static GetVariant() { return ShopStyleSetsParser.Data.map(row => row['Variant']); }
    static GetPanelassetoverride() { return ShopStyleSetsParser.Data.map(row => row['PanelAssetOverride']); }
    static GetOffercardassetoverride() { return ShopStyleSetsParser.Data.map(row => row['OfferCardAssetOverride']); }
    static GetPopupassetoverride() { return ShopStyleSetsParser.Data.map(row => row['PopupAssetOverride']); }
    static GetOverridebg() { return ShopStyleSetsParser.Data.map(row => row['OverrideBg']); }
}

export default ShopStyleSetsParser;
