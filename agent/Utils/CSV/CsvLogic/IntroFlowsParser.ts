class IntroFlowsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        IntroFlowsParser.Data = csvData;
    }
    static GetName() { return IntroFlowsParser.Data.map(row => row['Name']); }
    static GetDisabled() { return IntroFlowsParser.Data.map(row => row['Disabled']); }
    static GetContainerassetpathprefix() { return IntroFlowsParser.Data.map(row => row['ContainerAssetPathPrefix']); }
    static GetIdlestopframename() { return IntroFlowsParser.Data.map(row => row['IdleStopFrameName']); }
    static GetComponenttypes() { return IntroFlowsParser.Data.map(row => row['ComponentTypes']); }
    static GetComponentnames() { return IntroFlowsParser.Data.map(row => row['ComponentNames']); }
    static GetComponentstringvalues() { return IntroFlowsParser.Data.map(row => row['ComponentStringValues']); }
    static GetComponenttids() { return IntroFlowsParser.Data.map(row => row['ComponentTIDs']); }
    static GetNotsetseen() { return IntroFlowsParser.Data.map(row => row['NotSetSeen']); }
    static GetRequiredscassetid() { return IntroFlowsParser.Data.map(row => row['RequiredScAssetId']); }
}

export default IntroFlowsParser;
