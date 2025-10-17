class PlayerTitlesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        PlayerTitlesParser.Data = csvData;
    }
    static GetName() { return PlayerTitlesParser.Data.map(row => row['Name']); }
    static GetTitletid() { return PlayerTitlesParser.Data.map(row => row['TitleTID']); }
    static GetGradient() { return PlayerTitlesParser.Data.map(row => row['Gradient']); }
}

export default PlayerTitlesParser;
