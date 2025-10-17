class ClassArchetypesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ClassArchetypesParser.Data = csvData;
    }
    static GetName() { return ClassArchetypesParser.Data.map(row => row['Name']); }
    static GetTid() { return ClassArchetypesParser.Data.map(row => row['TID']); }
    static GetFramelabel() { return ClassArchetypesParser.Data.map(row => row['FrameLabel']); }
    static GetPluraltid() { return ClassArchetypesParser.Data.map(row => row['PluralTID']); }
}

export default ClassArchetypesParser;
