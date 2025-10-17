class BpPurchasePopupParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        BpPurchasePopupParser.Data = csvData;
    }
    static GetName() { return BpPurchasePopupParser.Data.map(row => row['Name']); }
    static GetSeason() { return BpPurchasePopupParser.Data.map(row => row['Season']); }
    static GetHeroarea1() { return BpPurchasePopupParser.Data.map(row => row['HeroArea1']); }
    static GetHeroarea2() { return BpPurchasePopupParser.Data.map(row => row['HeroArea2']); }
    static GetHeroarea3() { return BpPurchasePopupParser.Data.map(row => row['HeroArea3']); }
    static GetFramename() { return BpPurchasePopupParser.Data.map(row => row['FrameName']); }
    static GetSkin() { return BpPurchasePopupParser.Data.map(row => row['Skin']); }
    static GetSkinchroma() { return BpPurchasePopupParser.Data.map(row => row['SkinChroma']); }
    static GetPin() { return BpPurchasePopupParser.Data.map(row => row['Pin']); }
    static GetIcon() { return BpPurchasePopupParser.Data.map(row => row['Icon']); }
    static GetSpray() { return BpPurchasePopupParser.Data.map(row => row['Spray']); }
    static GetAnimcover() { return BpPurchasePopupParser.Data.map(row => row['AnimCover']); }
    static GetAnimskin() { return BpPurchasePopupParser.Data.map(row => row['AnimSkin']); }
    static GetAnimchromas() { return BpPurchasePopupParser.Data.map(row => row['AnimChromas']); }
    static GetJingle() { return BpPurchasePopupParser.Data.map(row => row['Jingle']); }
    static GetMultiplier() { return BpPurchasePopupParser.Data.map(row => row['Multiplier']); }
    static GetPlusmultiplier() { return BpPurchasePopupParser.Data.map(row => row['PlusMultiplier']); }
}

export default BpPurchasePopupParser;
