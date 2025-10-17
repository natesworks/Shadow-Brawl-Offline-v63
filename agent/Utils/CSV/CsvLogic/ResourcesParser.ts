class ResourcesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ResourcesParser.Data = csvData;
    }
    static GetName() { return ResourcesParser.Data.map(row => row['Name']); }
    static GetTid() { return ResourcesParser.Data.map(row => row['TID']); }
    static GetIconswf() { return ResourcesParser.Data.map(row => row['IconSWF']); }
    static GetCollecteffect() { return ResourcesParser.Data.map(row => row['CollectEffect']); }
    static GetIconexportname() { return ResourcesParser.Data.map(row => row['IconExportName']); }
    static GetType() { return ResourcesParser.Data.map(row => row['Type']); }
    static GetRarity() { return ResourcesParser.Data.map(row => row['Rarity']); }
    static GetPremiumcurrency() { return ResourcesParser.Data.map(row => row['PremiumCurrency']); }
    static GetTextred() { return ResourcesParser.Data.map(row => row['TextRed']); }
    static GetTextgreen() { return ResourcesParser.Data.map(row => row['TextGreen']); }
    static GetTextblue() { return ResourcesParser.Data.map(row => row['TextBlue']); }
    static GetCap() { return ResourcesParser.Data.map(row => row['Cap']); }
    static GetAllowedtooverflowcaponce() { return ResourcesParser.Data.map(row => row['AllowedToOverflowCapOnce']); }
}

export default ResourcesParser;
