class TraitsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        TraitsParser.Data = csvData;
    }
    static GetName() { return TraitsParser.Data.map(row => row['Name']); }
    static GetTarget() { return TraitsParser.Data.map(row => row['Target']); }
    static GetMetatype() { return TraitsParser.Data.map(row => row['MetaType']); }
    static GetServeronly() { return TraitsParser.Data.map(row => row['ServerOnly']); }
    static GetType() { return TraitsParser.Data.map(row => row['Type']); }
    static GetValue() { return TraitsParser.Data.map(row => row['Value']); }
    static GetProjectile() { return TraitsParser.Data.map(row => row['Projectile']); }
    static GetAreaeffect() { return TraitsParser.Data.map(row => row['AreaEffect']); }
    static GetCharacter() { return TraitsParser.Data.map(row => row['Character']); }
    static GetSkill() { return TraitsParser.Data.map(row => row['Skill']); }
    static GetStatuseffect() { return TraitsParser.Data.map(row => row['StatusEffect']); }
    static GetSecondprojectile() { return TraitsParser.Data.map(row => row['SecondProjectile']); }
    static GetSecondareaeffect() { return TraitsParser.Data.map(row => row['SecondAreaEffect']); }
}

export default TraitsParser;
