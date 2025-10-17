class HintsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        HintsParser.Data = csvData;
    }
    static GetName() { return HintsParser.Data.map(row => row['Name']); }
    static GetTid() { return HintsParser.Data.map(row => row['TID']); }
    static GetDisabled() { return HintsParser.Data.map(row => row['Disabled']); }
    static GetMinxplevel() { return HintsParser.Data.map(row => row['MinXPLevel']); }
    static GetMaxxplevel() { return HintsParser.Data.map(row => row['MaxXPLevel']); }
    static GetFilename() { return HintsParser.Data.map(row => row['FileName']); }
    static GetExportname() { return HintsParser.Data.map(row => row['ExportName']); }
    static GetCharacter() { return HintsParser.Data.map(row => row['Character']); }
    static GetReferringscid() { return HintsParser.Data.map(row => row['ReferringSCID']); }
}

export default HintsParser;
