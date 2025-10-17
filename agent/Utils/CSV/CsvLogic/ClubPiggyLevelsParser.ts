class ClubPiggyLevelsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ClubPiggyLevelsParser.Data = csvData;
    }
    static GetName() { return ClubPiggyLevelsParser.Data.map(row => row['Name']); }
    static GetWintracktype() { return ClubPiggyLevelsParser.Data.map(row => row['WinTrackType']); }
    static GetLevel() { return ClubPiggyLevelsParser.Data.map(row => row['Level']); }
    static GetState() { return ClubPiggyLevelsParser.Data.map(row => row['State']); }
    static GetShownlevelincounter() { return ClubPiggyLevelsParser.Data.map(row => row['ShownLevelInCounter']); }
    static GetHidelevelcountertext() { return ClubPiggyLevelsParser.Data.map(row => row['HideLevelCounterText']); }
}

export default ClubPiggyLevelsParser;
