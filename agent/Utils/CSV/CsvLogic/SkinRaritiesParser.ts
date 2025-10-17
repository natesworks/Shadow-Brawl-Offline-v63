class SkinRaritiesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        SkinRaritiesParser.Data = csvData;
    }
    static GetName() { return SkinRaritiesParser.Data.map(row => row['Name']); }
    static GetPrice() { return SkinRaritiesParser.Data.map(row => row['Price']); }
    static GetRarity() { return SkinRaritiesParser.Data.map(row => row['Rarity']); }
    static GetChromaprice() { return SkinRaritiesParser.Data.map(row => row['ChromaPrice']); }
}

export default SkinRaritiesParser;
