class TrophyWorldPartsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        TrophyWorldPartsParser.Data = csvData;
    }
    static GetName() { return TrophyWorldPartsParser.Data.map(row => row['Name']); }
    static GetScfilename() { return TrophyWorldPartsParser.Data.map(row => row['ScFileName']); }
    static GetExportname() { return TrophyWorldPartsParser.Data.map(row => row['ExportName']); }
    static GetWidth() { return TrophyWorldPartsParser.Data.map(row => row['Width']); }
    static GetRewardsparentinstancenamepath() { return TrophyWorldPartsParser.Data.map(row => row['RewardsParentInstanceNamePath']); }
    static GetIconexportpath() { return TrophyWorldPartsParser.Data.map(row => row['IconExportPath']); }
    static GetWorld() { return TrophyWorldPartsParser.Data.map(row => row['World']); }
    static GetMilestoneinstancenameprefix() { return TrophyWorldPartsParser.Data.map(row => row['MilestoneInstanceNamePrefix']); }
    static GetMilestonenamestartnum() { return TrophyWorldPartsParser.Data.map(row => row['MilestoneNameStartNum']); }
    static GetLayerinstancenames() { return TrophyWorldPartsParser.Data.map(row => row['LayerInstanceNames']); }
    static GetLayerspeedpercentoverrides() { return TrophyWorldPartsParser.Data.map(row => row['LayerSpeedPercentOverrides']); }
    static GetLayeroriginpercentagesofscreenwidth() { return TrophyWorldPartsParser.Data.map(row => row['LayerOriginPercentagesOfScreenWidth']); }
    static GetComponentnames() { return TrophyWorldPartsParser.Data.map(row => row['ComponentNames']); }
    static GetComponenttypes() { return TrophyWorldPartsParser.Data.map(row => row['ComponentTypes']); }
    static GetComponentstringvalues() { return TrophyWorldPartsParser.Data.map(row => row['ComponentStringValues']); }
    static GetComponentintvalues() { return TrophyWorldPartsParser.Data.map(row => row['ComponentIntValues']); }
}

export default TrophyWorldPartsParser;
