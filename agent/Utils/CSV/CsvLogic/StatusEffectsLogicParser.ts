class StatusEffectsLogicParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        StatusEffectsLogicParser.Data = csvData;
    }
    static GetName() { return StatusEffectsLogicParser.Data.map(row => row['Name']); }
    static GetDurationticks() { return StatusEffectsLogicParser.Data.map(row => row['DurationTicks']); }
    static GetGradualwearoffafter() { return StatusEffectsLogicParser.Data.map(row => row['GradualWearOffAfter']); }
    static GetCancelondamage() { return StatusEffectsLogicParser.Data.map(row => row['CancelOnDamage']); }
    static GetCanceloncharge() { return StatusEffectsLogicParser.Data.map(row => row['CancelOnCharge']); }
    static GetCancelonchargeend() { return StatusEffectsLogicParser.Data.map(row => row['CancelOnChargeEnd']); }
    static GetCancelonhealthregen() { return StatusEffectsLogicParser.Data.map(row => row['CancelOnHealthRegen']); }
    static GetCancelonsourcedeath() { return StatusEffectsLogicParser.Data.map(row => row['CancelOnSourceDeath']); }
    static GetTriggerrate() { return StatusEffectsLogicParser.Data.map(row => row['TriggerRate']); }
    static GetTriggeronfirsttick() { return StatusEffectsLogicParser.Data.map(row => row['TriggerOnFirstTick']); }
    static GetStacking() { return StatusEffectsLogicParser.Data.map(row => row['Stacking']); }
    static GetRefreshable() { return StatusEffectsLogicParser.Data.map(row => row['Refreshable']); }
    static GetPulsatingactivetickson() { return StatusEffectsLogicParser.Data.map(row => row['PulsatingActiveTicksOn']); }
    static GetPulsatingactiveticksoff() { return StatusEffectsLogicParser.Data.map(row => row['PulsatingActiveTicksOff']); }
    static GetDamage() { return StatusEffectsLogicParser.Data.map(row => row['Damage']); }
    static GetDamagehealsource() { return StatusEffectsLogicParser.Data.map(row => row['DamageHealSource']); }
    static GetUltichargepercent() { return StatusEffectsLogicParser.Data.map(row => row['UltiChargePercent']); }
    static GetAmmoreducepercent() { return StatusEffectsLogicParser.Data.map(row => row['AmmoReducePercent']); }
    static GetHealing() { return StatusEffectsLogicParser.Data.map(row => row['Healing']); }
    static GetShieldpercent() { return StatusEffectsLogicParser.Data.map(row => row['ShieldPercent']); }
    static GetSpeedboostpercent() { return StatusEffectsLogicParser.Data.map(row => row['SpeedBoostPercent']); }
    static GetSpeedboostabsolute() { return StatusEffectsLogicParser.Data.map(row => row['SpeedBoostAbsolute']); }
    static GetSpeedreducepercent() { return StatusEffectsLogicParser.Data.map(row => row['SpeedReducePercent']); }
    static GetSpeedreduceabsolute() { return StatusEffectsLogicParser.Data.map(row => row['SpeedReduceAbsolute']); }
    static GetDamageboostpercent() { return StatusEffectsLogicParser.Data.map(row => row['DamageBoostPercent']); }
    static GetDamagereducepercent() { return StatusEffectsLogicParser.Data.map(row => row['DamageReducePercent']); }
    static GetDamageboosttargetcurrenthealthpercent() { return StatusEffectsLogicParser.Data.map(row => row['DamageBoostTargetCurrentHealthPercent']); }
    static GetDamagereceivedboostpercent() { return StatusEffectsLogicParser.Data.map(row => row['DamageReceivedBoostPercent']); }
    static GetDamagereceivedboostabsolute() { return StatusEffectsLogicParser.Data.map(row => row['DamageReceivedBoostAbsolute']); }
    static GetCleanse() { return StatusEffectsLogicParser.Data.map(row => row['Cleanse']); }
    static GetDoblinkclear() { return StatusEffectsLogicParser.Data.map(row => row['DoBlinkClear']); }
    static GetCcimmunity() { return StatusEffectsLogicParser.Data.map(row => row['CcImmunity']); }
    static GetAttackimmunity() { return StatusEffectsLogicParser.Data.map(row => row['AttackImmunity']); }
    static GetInvisibility() { return StatusEffectsLogicParser.Data.map(row => row['Invisibility']); }
    static GetForceshow() { return StatusEffectsLogicParser.Data.map(row => row['ForceShow']); }
    static GetLoseplayercontrol() { return StatusEffectsLogicParser.Data.map(row => row['LosePlayerControl']); }
    static GetFullstun() { return StatusEffectsLogicParser.Data.map(row => row['FullStun']); }
    static GetTaunt() { return StatusEffectsLogicParser.Data.map(row => row['Taunt']); }
    static GetStasis() { return StatusEffectsLogicParser.Data.map(row => row['Stasis']); }
    static GetSilence() { return StatusEffectsLogicParser.Data.map(row => row['Silence']); }
    static GetScalewithupgrades() { return StatusEffectsLogicParser.Data.map(row => row['ScaleWithUpgrades']); }
    static GetScalewithbuffs() { return StatusEffectsLogicParser.Data.map(row => row['ScaleWithBuffs']); }
    static GetIsdebuff() { return StatusEffectsLogicParser.Data.map(row => row['IsDebuff']); }
    static GetAttackpiercecharacters() { return StatusEffectsLogicParser.Data.map(row => row['AttackPierceCharacters']); }
    static GetAttackthroughwalls() { return StatusEffectsLogicParser.Data.map(row => row['AttackThroughWalls']); }
    static GetUltiattackthroughwalls() { return StatusEffectsLogicParser.Data.map(row => row['UltiAttackThroughWalls']); }
    static GetMovethroughwalls() { return StatusEffectsLogicParser.Data.map(row => row['MoveThroughWalls']); }
    static GetMovethroughwater() { return StatusEffectsLogicParser.Data.map(row => row['MoveThroughWater']); }
    static GetServeronly() { return StatusEffectsLogicParser.Data.map(row => row['ServerOnly']); }
    static GetSpawncharacterondeath() { return StatusEffectsLogicParser.Data.map(row => row['SpawnCharacterOnDeath']); }
    static GetSpawnareaeffectondeath() { return StatusEffectsLogicParser.Data.map(row => row['SpawnAreaEffectOnDeath']); }
    static GetPersisttransformation() { return StatusEffectsLogicParser.Data.map(row => row['PersistTransformation']); }
    static GetBooleanattributes() { return StatusEffectsLogicParser.Data.map(row => row['BooleanAttributes']); }
    static GetHapticstosource() { return StatusEffectsLogicParser.Data.map(row => row['HapticsToSource']); }
    static GetTimerbar() { return StatusEffectsLogicParser.Data.map(row => row['TimerBar']); }
}

export default StatusEffectsLogicParser;
