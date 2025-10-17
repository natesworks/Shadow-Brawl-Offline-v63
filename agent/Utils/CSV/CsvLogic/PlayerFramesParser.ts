class PlayerFramesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        PlayerFramesParser.Data = csvData;
    }
    static GetName() { return PlayerFramesParser.Data.map(row => row['Name']); }
    static GetDisabled() { return PlayerFramesParser.Data.map(row => row['Disabled']); }
    static GetIconswf() { return PlayerFramesParser.Data.map(row => row['IconSWF']); }
    static GetIconexportname() { return PlayerFramesParser.Data.map(row => row['IconExportName']); }
    static GetIconexportnamefront() { return PlayerFramesParser.Data.map(row => row['IconExportNameFront']); }
    static GetIconexportnamelevels() { return PlayerFramesParser.Data.map(row => row['IconExportNameLevels']); }
    static GetBanner() { return PlayerFramesParser.Data.map(row => row['Banner']); }
    static GetIconontop() { return PlayerFramesParser.Data.map(row => row['IconOnTop']); }
    static GetTier() { return PlayerFramesParser.Data.map(row => row['Tier']); }
    static GetSeason() { return PlayerFramesParser.Data.map(row => row['Season']); }
    static GetFrametype() { return PlayerFramesParser.Data.map(row => row['FrameType']); }
    static GetUnlockedbyfame() { return PlayerFramesParser.Data.map(row => row['UnlockedByFame']); }
    static GetDelaymilliseconds() { return PlayerFramesParser.Data.map(row => row['DelayMilliseconds']); }
    static GetDescriptiontid() { return PlayerFramesParser.Data.map(row => row['DescriptionTID']); }
}

export default PlayerFramesParser;
