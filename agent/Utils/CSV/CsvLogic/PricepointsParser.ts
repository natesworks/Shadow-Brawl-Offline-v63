class PricepointsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        PricepointsParser.Data = csvData;
    }
    static GetName() { return PricepointsParser.Data.map(row => row['Name']); }
    static GetBillingpackages() { return PricepointsParser.Data.map(row => row['BillingPackages']); }
    static GetTiers() { return PricepointsParser.Data.map(row => row['Tiers']); }
}

export default PricepointsParser;
