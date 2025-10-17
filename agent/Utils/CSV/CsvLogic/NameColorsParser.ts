class NameColorsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        NameColorsParser.Data = csvData;
    }
    static GetName() { return NameColorsParser.Data.map(row => row['Name']); }
    static GetColorcode() { return NameColorsParser.Data.map(row => row['ColorCode']); }
    static GetGradient() { return NameColorsParser.Data.map(row => row['Gradient']); }
    static GetRequiredtotaltrophies() { return NameColorsParser.Data.map(row => row['RequiredTotalTrophies']); }
    static GetRequiredseasonpoints() { return NameColorsParser.Data.map(row => row['RequiredSeasonPoints']); }
    static GetRequiredhero() { return NameColorsParser.Data.map(row => row['RequiredHero']); }
    static GetSortorder() { return NameColorsParser.Data.map(row => row['SortOrder']); }
    static GetColorgradient() { return NameColorsParser.Data.map(row => row['ColorGradient']); }
}

export default NameColorsParser;
