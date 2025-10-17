class VisualOfferGroupingsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        VisualOfferGroupingsParser.Data = csvData;
    }
    static GetName() { return VisualOfferGroupingsParser.Data.map(row => row['Name']); }
    static GetDisabled() { return VisualOfferGroupingsParser.Data.map(row => row['Disabled']); }
    static GetDefaultassetfilename() { return VisualOfferGroupingsParser.Data.map(row => row['DefaultAssetFileName']); }
    static GetScreencontainerprefix() { return VisualOfferGroupingsParser.Data.map(row => row['ScreenContainerPrefix']); }
    static GetCardpanelasset() { return VisualOfferGroupingsParser.Data.map(row => row['CardPanelAsset']); }
    static GetCardasset() { return VisualOfferGroupingsParser.Data.map(row => row['CardAsset']); }
    static GetCardassetwithouthighlightskin() { return VisualOfferGroupingsParser.Data.map(row => row['CardAssetWithoutHighlightSkin']); }
    static GetDefaulttitletid() { return VisualOfferGroupingsParser.Data.map(row => row['DefaultTitleTID']); }
    static GetDefaultsubtitletid() { return VisualOfferGroupingsParser.Data.map(row => row['DefaultSubtitleTID']); }
}

export default VisualOfferGroupingsParser;
