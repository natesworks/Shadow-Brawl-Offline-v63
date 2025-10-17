class EnumeratedIdListsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        EnumeratedIdListsParser.Data = csvData;
    }
    static GetName() { return EnumeratedIdListsParser.Data.map(row => row['Name']); }
    static GetUniquevalues() { return EnumeratedIdListsParser.Data.map(row => row['UniqueValues']); }
    static GetUniqueids() { return EnumeratedIdListsParser.Data.map(row => row['UniqueIds']); }
    static GetStringcontent() { return EnumeratedIdListsParser.Data.map(row => row['StringContent']); }
}

export default EnumeratedIdListsParser;
