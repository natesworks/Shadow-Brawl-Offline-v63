class CampaignParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        CampaignParser.Data = csvData;
    }
    static GetName() { return CampaignParser.Data.map(row => row['Name']); }
    static GetTid() { return CampaignParser.Data.map(row => row['TID']); }
}

export default CampaignParser;
