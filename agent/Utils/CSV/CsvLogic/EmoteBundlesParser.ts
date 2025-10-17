class EmoteBundlesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        EmoteBundlesParser.Data = csvData;
    }
    static GetName() { return EmoteBundlesParser.Data.map(row => row['Name']); }
    static GetDisabled() { return EmoteBundlesParser.Data.map(row => row['Disabled']); }
    static GetIconswf() { return EmoteBundlesParser.Data.map(row => row['IconSWF']); }
    static GetIconexportname() { return EmoteBundlesParser.Data.map(row => row['IconExportName']); }
    static GetTid() { return EmoteBundlesParser.Data.map(row => row['TID']); }
    static GetCanbebought() { return EmoteBundlesParser.Data.map(row => row['CanBeBought']); }
    static GetRepresentinghighlightemote() { return EmoteBundlesParser.Data.map(row => row['RepresentingHighlightEmote']); }
}

export default EmoteBundlesParser;
