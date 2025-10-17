class EffectsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        EffectsParser.Data = csvData;
    }
    static GetName() { return EffectsParser.Data.map(row => row['Name']); }
    static GetLoop() { return EffectsParser.Data.map(row => row['Loop']); }
    static GetAngletospawnoffset() { return EffectsParser.Data.map(row => row['AngleToSpawnOffset']); }
    static GetFollowparent() { return EffectsParser.Data.map(row => row['FollowParent']); }
    static GetFollowparentangle() { return EffectsParser.Data.map(row => row['FollowParentAngle']); }
    static GetFollowbone() { return EffectsParser.Data.map(row => row['FollowBone']); }
    static GetOwnscreenshake() { return EffectsParser.Data.map(row => row['OwnScreenShake']); }
    static GetOthersscreenshake() { return EffectsParser.Data.map(row => row['OthersScreenShake']); }
    static GetOwnhapticlevel() { return EffectsParser.Data.map(row => row['OwnHapticLevel']); }
    static GetOthershapticlevel() { return EffectsParser.Data.map(row => row['OthersHapticLevel']); }
    static GetTime() { return EffectsParser.Data.map(row => row['Time']); }
    static GetSound() { return EffectsParser.Data.map(row => row['Sound']); }
    static GetType() { return EffectsParser.Data.map(row => row['Type']); }
    static GetFilename() { return EffectsParser.Data.map(row => row['FileName']); }
    static GetExportname() { return EffectsParser.Data.map(row => row['ExportName']); }
    static GetParticleemittername() { return EffectsParser.Data.map(row => row['ParticleEmitterName']); }
    static GetEffect() { return EffectsParser.Data.map(row => row['Effect']); }
    static GetLayer() { return EffectsParser.Data.map(row => row['Layer']); }
    static GetGroundbasis() { return EffectsParser.Data.map(row => row['GroundBasis']); }
    static GetFlashcolor() { return EffectsParser.Data.map(row => row['FlashColor']); }
    static GetScale() { return EffectsParser.Data.map(row => row['Scale']); }
    static GetFlashduration() { return EffectsParser.Data.map(row => row['FlashDuration']); }
    static GetTextinstancename() { return EffectsParser.Data.map(row => row['TextInstanceName']); }
    static GetTextparentinstancename() { return EffectsParser.Data.map(row => row['TextParentInstanceName']); }
    static GetEnemyversion() { return EffectsParser.Data.map(row => row['EnemyVersion']); }
    static GetChinareplacement() { return EffectsParser.Data.map(row => row['ChinaReplacement']); }
    static GetFlashwidth() { return EffectsParser.Data.map(row => row['FlashWidth']); }
    static GetEffectz() { return EffectsParser.Data.map(row => row['EffectZ']); }
}

export default EffectsParser;
