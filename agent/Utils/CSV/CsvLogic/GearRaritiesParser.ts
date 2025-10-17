class GearRaritiesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        GearRaritiesParser.Data = csvData;
    }
    static GetName() { return GearRaritiesParser.Data.map(row => row['Name']); }
    static GetCoinprice() { return GearRaritiesParser.Data.map(row => row['CoinPrice']); }
    static GetTid() { return GearRaritiesParser.Data.map(row => row['TID']); }
    static GetAvailabletoallbrawlers() { return GearRaritiesParser.Data.map(row => row['AvailableToAllBrawlers']); }
    static GetIconframeindex() { return GearRaritiesParser.Data.map(row => row['IconFrameIndex']); }
    static GetNotownediconbgframeindex() { return GearRaritiesParser.Data.map(row => row['NotOwnedIconBgFrameIndex']); }
    static GetTextcolor() { return GearRaritiesParser.Data.map(row => row['TextColor']); }
    static GetGeartitlewithraritytid() { return GearRaritiesParser.Data.map(row => row['GearTitleWithRarityTID']); }
}

export default GearRaritiesParser;
