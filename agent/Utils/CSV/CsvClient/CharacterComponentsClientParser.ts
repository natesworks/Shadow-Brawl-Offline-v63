class CharacterComponentsClientParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        CharacterComponentsClientParser.Data = csvData;
    }
    static GetName() { return CharacterComponentsClientParser.Data.map(row => row['Name']); }
    static GetType() { return CharacterComponentsClientParser.Data.map(row => row['Type']); }
    static GetIntvalues() { return CharacterComponentsClientParser.Data.map(row => row['IntValues']); }
    static GetBoolvalues() { return CharacterComponentsClientParser.Data.map(row => row['BoolValues']); }
    static GetEffects() { return CharacterComponentsClientParser.Data.map(row => row['Effects']); }
}

export default CharacterComponentsClientParser;
