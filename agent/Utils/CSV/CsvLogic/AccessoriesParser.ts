class AccessoriesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        AccessoriesParser.Data = csvData;
    }
    static GetName() { return AccessoriesParser.Data.map(row => row['Name']); }
    static GetType() { return AccessoriesParser.Data.map(row => row['Type']); }
    static GetSubtype() { return AccessoriesParser.Data.map(row => row['SubType']); }
    static GetCooldown() { return AccessoriesParser.Data.map(row => row['Cooldown']); }
    static GetUseeffect() { return AccessoriesParser.Data.map(row => row['UseEffect']); }
    static GetPetuseeffect() { return AccessoriesParser.Data.map(row => row['PetUseEffect']); }
    static GetLoopingeffect() { return AccessoriesParser.Data.map(row => row['LoopingEffect']); }
    static GetLoopingeffectpet() { return AccessoriesParser.Data.map(row => row['LoopingEffectPet']); }
    static GetActivationdelay() { return AccessoriesParser.Data.map(row => row['ActivationDelay']); }
    static GetActiveticks() { return AccessoriesParser.Data.map(row => row['ActiveTicks']); }
    static GetShowcountdown() { return AccessoriesParser.Data.map(row => row['ShowCountdown']); }
    static GetStopmovement() { return AccessoriesParser.Data.map(row => row['StopMovement']); }
    static GetStoppetfordelay() { return AccessoriesParser.Data.map(row => row['StopPetForDelay']); }
    static GetAnimationindex() { return AccessoriesParser.Data.map(row => row['AnimationIndex']); }
    static GetSetattackangle() { return AccessoriesParser.Data.map(row => row['SetAttackAngle']); }
    static GetAimguidetype() { return AccessoriesParser.Data.map(row => row['AimGuideType']); }
    static GetConsumesammo() { return AccessoriesParser.Data.map(row => row['ConsumesAmmo']); }
    static GetStatuseffectally() { return AccessoriesParser.Data.map(row => row['StatusEffectAlly']); }
    static GetStatuseffectenemy() { return AccessoriesParser.Data.map(row => row['StatusEffectEnemy']); }
    static GetAreaeffect() { return AccessoriesParser.Data.map(row => row['AreaEffect']); }
    static GetPetareaeffect() { return AccessoriesParser.Data.map(row => row['PetAreaEffect']); }
    static GetInterruptsaction() { return AccessoriesParser.Data.map(row => row['InterruptsAction']); }
    static GetAllowstunactivation() { return AccessoriesParser.Data.map(row => row['AllowStunActivation']); }
    static GetInterruptable() { return AccessoriesParser.Data.map(row => row['Interruptable']); }
    static GetRequirepetdistance() { return AccessoriesParser.Data.map(row => row['RequirePetDistance']); }
    static GetDestroypet() { return AccessoriesParser.Data.map(row => row['DestroyPet']); }
    static GetRange() { return AccessoriesParser.Data.map(row => row['Range']); }
    static GetRequireenemyinrange() { return AccessoriesParser.Data.map(row => row['RequireEnemyInRange']); }
    static GetTargetfriends() { return AccessoriesParser.Data.map(row => row['TargetFriends']); }
    static GetTargetindirect() { return AccessoriesParser.Data.map(row => row['TargetIndirect']); }
    static GetShieldpercent() { return AccessoriesParser.Data.map(row => row['ShieldPercent']); }
    static GetShieldticks() { return AccessoriesParser.Data.map(row => row['ShieldTicks']); }
    static GetSpeedboost() { return AccessoriesParser.Data.map(row => row['SpeedBoost']); }
    static GetSpeedboostticks() { return AccessoriesParser.Data.map(row => row['SpeedBoostTicks']); }
    static GetSkiptypecondition() { return AccessoriesParser.Data.map(row => row['SkipTypeCondition']); }
    static GetUsableduringcharge() { return AccessoriesParser.Data.map(row => row['UsableDuringCharge']); }
    static GetUsableinshadowrealm() { return AccessoriesParser.Data.map(row => row['UsableInShadowRealm']); }
    static GetCustomobject() { return AccessoriesParser.Data.map(row => row['CustomObject']); }
    static GetCustomvalue1() { return AccessoriesParser.Data.map(row => row['CustomValue1']); }
    static GetCustomvalue2() { return AccessoriesParser.Data.map(row => row['CustomValue2']); }
    static GetCustomvalue3() { return AccessoriesParser.Data.map(row => row['CustomValue3']); }
    static GetCustomvalue4() { return AccessoriesParser.Data.map(row => row['CustomValue4']); }
    static GetCustomvalue5() { return AccessoriesParser.Data.map(row => row['CustomValue5']); }
    static GetCustomvalue6() { return AccessoriesParser.Data.map(row => row['CustomValue6']); }
    static GetMissingtargettext() { return AccessoriesParser.Data.map(row => row['MissingTargetText']); }
    static GetTargettoofartext() { return AccessoriesParser.Data.map(row => row['TargetTooFarText']); }
    static GetTargetalreadyactivetext() { return AccessoriesParser.Data.map(row => row['TargetAlreadyActiveText']); }
    static GetRequiresspecificactiontext() { return AccessoriesParser.Data.map(row => row['RequiresSpecificActionText']); }
    static GetCustomblocktext() { return AccessoriesParser.Data.map(row => row['CustomBlockText']); }
}

export default AccessoriesParser;
