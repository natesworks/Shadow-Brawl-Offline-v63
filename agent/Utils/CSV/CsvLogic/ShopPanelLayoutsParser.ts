class ShopPanelLayoutsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ShopPanelLayoutsParser.Data = csvData;
    }
    static GetName() { return ShopPanelLayoutsParser.Data.map(row => row['Name']); }
    static GetDisabled() { return ShopPanelLayoutsParser.Data.map(row => row['Disabled']); }
    static GetLayouttype() { return ShopPanelLayoutsParser.Data.map(row => row['LayoutType']); }
    static GetAssetfilename() { return ShopPanelLayoutsParser.Data.map(row => row['AssetFileName']); }
    static GetPanelasset() { return ShopPanelLayoutsParser.Data.map(row => row['PanelAsset']); }
    static GetAsset() { return ShopPanelLayoutsParser.Data.map(row => row['Asset']); }
    static GetAssetwithouthighlightskin() { return ShopPanelLayoutsParser.Data.map(row => row['AssetWithoutHighlightSkin']); }
    static GetItems() { return ShopPanelLayoutsParser.Data.map(row => row['Items']); }
    static GetItemplaceholdernames() { return ShopPanelLayoutsParser.Data.map(row => row['ItemPlaceholderNames']); }
    static GetItemcontextnames() { return ShopPanelLayoutsParser.Data.map(row => row['ItemContextNames']); }
    static GetCustomtitletid() { return ShopPanelLayoutsParser.Data.map(row => row['CustomTitleTID']); }
    static GetCustomsubtitletid() { return ShopPanelLayoutsParser.Data.map(row => row['CustomSubtitleTID']); }
}

export default ShopPanelLayoutsParser;
