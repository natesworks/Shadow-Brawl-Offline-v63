class BossesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        BossesParser.Data = csvData;
    }
    static GetName() { return BossesParser.Data.map(row => row['Name']); }
    static GetVulnerablestatestartticks() { return BossesParser.Data.map(row => row['VulnerableStateStartTicks']); }
    static GetVulnerablestatedurationticks() { return BossesParser.Data.map(row => row['VulnerableStateDurationTicks']); }
    static GetVulnerablestatuseffect() { return BossesParser.Data.map(row => row['VulnerableStatusEffect']); }
    static GetStartfreezesecond() { return BossesParser.Data.map(row => row['StartFreezeSecond']); }
    static GetNumskills() { return BossesParser.Data.map(row => row['NumSkills']); }
    static GetAttackskills() { return BossesParser.Data.map(row => row['AttackSkills']); }
    static GetAttackmaxcount() { return BossesParser.Data.map(row => row['AttackMaxCount']); }
    static GetDamageincrease() { return BossesParser.Data.map(row => row['DamageIncrease']); }
    static GetAttackpredelayticks() { return BossesParser.Data.map(row => row['AttackPreDelayTicks']); }
    static GetAttackcooldownticks() { return BossesParser.Data.map(row => row['AttackCooldownTicks']); }
    static GetAttackindicatorstyles() { return BossesParser.Data.map(row => row['AttackIndicatorStyles']); }
    static GetAttackindicatorareaeffects() { return BossesParser.Data.map(row => row['AttackIndicatorAreaEffects']); }
    static GetAttackindicatordistances() { return BossesParser.Data.map(row => row['AttackIndicatorDistances']); }
    static GetAttackindicatorwidth() { return BossesParser.Data.map(row => row['AttackIndicatorWidth']); }
    static GetMovestyle() { return BossesParser.Data.map(row => row['MoveStyle']); }
    static GetSkilltpcameratype() { return BossesParser.Data.map(row => row['SkillTPCameraType']); }
    static GetBattleintroframelabel() { return BossesParser.Data.map(row => row['BattleIntroFrameLabel']); }
    static GetChatsuggestionitemname() { return BossesParser.Data.map(row => row['ChatSuggestionItemName']); }
    static GetGamemodeiconname() { return BossesParser.Data.map(row => row['GameModeIconName']); }
    static GetGamemoderoomiconname() { return BossesParser.Data.map(row => row['GameModeRoomIconName']); }
}

export default BossesParser;
