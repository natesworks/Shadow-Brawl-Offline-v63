class CharacterComponentsLogicParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        CharacterComponentsLogicParser.Data = csvData;
    }
    static GetName() { return CharacterComponentsLogicParser.Data.map(row => row['Name']); }
    static GetType() { return CharacterComponentsLogicParser.Data.map(row => row['Type']); }
    static GetValues() { return CharacterComponentsLogicParser.Data.map(row => row['Values']); }
    static GetProjectiles() { return CharacterComponentsLogicParser.Data.map(row => row['Projectiles']); }
    static GetAreaeffects() { return CharacterComponentsLogicParser.Data.map(row => row['AreaEffects']); }
    static GetCharacters() { return CharacterComponentsLogicParser.Data.map(row => row['Characters']); }
    static GetSkills() { return CharacterComponentsLogicParser.Data.map(row => row['Skills']); }
    static GetStatuseffects() { return CharacterComponentsLogicParser.Data.map(row => row['StatusEffects']); }
}

export default CharacterComponentsLogicParser;
