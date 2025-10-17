class StatusEffectsSkinParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        StatusEffectsSkinParser.Data = csvData;
    }
    static GetName() { return StatusEffectsSkinParser.Data.map(row => row['Name']); }
    static GetLogic() { return StatusEffectsSkinParser.Data.map(row => row['Logic']); }
    static GetChainstatuseffect() { return StatusEffectsSkinParser.Data.map(row => row['ChainStatusEffect']); }
    static GetChainstatuseffect2() { return StatusEffectsSkinParser.Data.map(row => row['ChainStatusEffect2']); }
    static GetStatustoapplyonend() { return StatusEffectsSkinParser.Data.map(row => row['StatusToApplyOnEnd']); }
    static GetUsecolormod() { return StatusEffectsSkinParser.Data.map(row => row['UseColorMod']); }
    static GetRedadd() { return StatusEffectsSkinParser.Data.map(row => row['RedAdd']); }
    static GetGreenadd() { return StatusEffectsSkinParser.Data.map(row => row['GreenAdd']); }
    static GetBlueadd() { return StatusEffectsSkinParser.Data.map(row => row['BlueAdd']); }
    static GetFullscreenadd() { return StatusEffectsSkinParser.Data.map(row => row['FullScreenAdd']); }
    static GetFullscreenmul() { return StatusEffectsSkinParser.Data.map(row => row['FullScreenMul']); }
    static GetFullscreeneffectfile() { return StatusEffectsSkinParser.Data.map(row => row['FullScreenEffectFile']); }
    static GetFullscreeneffectname() { return StatusEffectsSkinParser.Data.map(row => row['FullScreenEffectName']); }
    static GetStarteffect() { return StatusEffectsSkinParser.Data.map(row => row['StartEffect']); }
    static GetLoopedeffect() { return StatusEffectsSkinParser.Data.map(row => row['LoopedEffect']); }
    static GetLoopedeffectremovetype() { return StatusEffectsSkinParser.Data.map(row => row['LoopedEffectRemoveType']); }
    static GetTriggereffect() { return StatusEffectsSkinParser.Data.map(row => row['TriggerEffect']); }
    static GetEndeffect() { return StatusEffectsSkinParser.Data.map(row => row['EndEffect']); }
}

export default StatusEffectsSkinParser;
