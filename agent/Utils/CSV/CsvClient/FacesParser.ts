class FacesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        FacesParser.Data = csvData;
    }
    static GetName() { return FacesParser.Data.map(row => row['Name']); }
    static GetFilename() { return FacesParser.Data.map(row => row['FileName']); }
    static GetExportname() { return FacesParser.Data.map(row => row['ExportName']); }
}

export default FacesParser;
