class AllianceLeagueRanksParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        AllianceLeagueRanksParser.Data = csvData;
    }
    static GetName() { return AllianceLeagueRanksParser.Data.map(row => row['Name']); }
    static GetRank() { return AllianceLeagueRanksParser.Data.map(row => row['Rank']); }
    static GetTid() { return AllianceLeagueRanksParser.Data.map(row => row['TID']); }
    static GetHexcolor() { return AllianceLeagueRanksParser.Data.map(row => row['HexColor']); }
    static GetFramelabel() { return AllianceLeagueRanksParser.Data.map(row => row['FrameLabel']); }
    static GetRankicontextfield() { return AllianceLeagueRanksParser.Data.map(row => row['RankIconTextField']); }
    static GetRankicontid() { return AllianceLeagueRanksParser.Data.map(row => row['RankIconTID']); }
    static GetBannerfilename() { return AllianceLeagueRanksParser.Data.map(row => row['BannerFileName']); }
    static GetBannerexportname() { return AllianceLeagueRanksParser.Data.map(row => row['BannerExportName']); }
}

export default AllianceLeagueRanksParser;
