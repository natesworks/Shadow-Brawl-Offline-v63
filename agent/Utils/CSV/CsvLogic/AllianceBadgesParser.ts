class AllianceBadgesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        AllianceBadgesParser.Data = csvData;
    }
    static GetName() { return AllianceBadgesParser.Data.map(row => row['Name']); }
    static GetIconswf() { return AllianceBadgesParser.Data.map(row => row['IconSWF']); }
    static GetIconexportname() { return AllianceBadgesParser.Data.map(row => row['IconExportName']); }
    static GetCategory() { return AllianceBadgesParser.Data.map(row => row['Category']); }
}

export default AllianceBadgesParser;
