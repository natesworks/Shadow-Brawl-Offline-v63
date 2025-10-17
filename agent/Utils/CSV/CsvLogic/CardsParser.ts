class CardsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        CardsParser.Data = csvData;
    }
    static GetName() { return CardsParser.Data.map(row => row['Name']); }
    static GetLinkedcard() { return CardsParser.Data.map(row => row['LinkedCard']); }
    static GetIconswf() { return CardsParser.Data.map(row => row['IconSWF']); }
    static GetIconexportname() { return CardsParser.Data.map(row => row['IconExportName']); }
    static GetTarget() { return CardsParser.Data.map(row => row['Target']); }
    static GetTargetclassarchetype() { return CardsParser.Data.map(row => row['TargetClassArchetype']); }
    static GetDisabled() { return CardsParser.Data.map(row => row['Disabled']); }
    static GetLockedforchronos() { return CardsParser.Data.map(row => row['LockedForChronos']); }
    static GetRequiredchromatics() { return CardsParser.Data.map(row => row['RequiredChromatics']); }
    static GetMetatype() { return CardsParser.Data.map(row => row['MetaType']); }
    static GetRequirescard() { return CardsParser.Data.map(row => row['RequiresCard']); }
    static GetType() { return CardsParser.Data.map(row => row['Type']); }
    static GetSubtype() { return CardsParser.Data.map(row => row['SubType']); }
    static GetSkill() { return CardsParser.Data.map(row => row['Skill']); }
    static GetValue() { return CardsParser.Data.map(row => row['Value']); }
    static GetValue2() { return CardsParser.Data.map(row => row['Value2']); }
    static GetValue3() { return CardsParser.Data.map(row => row['Value3']); }
    static GetValue4() { return CardsParser.Data.map(row => row['Value4']); }
    static GetValue5() { return CardsParser.Data.map(row => row['Value5']); }
    static GetValue6() { return CardsParser.Data.map(row => row['Value6']); }
    static GetStatuseffect() { return CardsParser.Data.map(row => row['StatusEffect']); }
    static GetStatuseffectovercharged() { return CardsParser.Data.map(row => row['StatusEffectOvercharged']); }
    static GetAreaeffect() { return CardsParser.Data.map(row => row['AreaEffect']); }
    static GetTraits() { return CardsParser.Data.map(row => row['Traits']); }
    static GetComponents() { return CardsParser.Data.map(row => row['Components']); }
    static GetRarity() { return CardsParser.Data.map(row => row['Rarity']); }
    static GetTid() { return CardsParser.Data.map(row => row['TID']); }
    static GetOverridedescription() { return CardsParser.Data.map(row => row['OverrideDescription']); }
    static GetPowernumbertid() { return CardsParser.Data.map(row => row['PowerNumberTID']); }
    static GetPowernumber2tid() { return CardsParser.Data.map(row => row['PowerNumber2TID']); }
    static GetPowernumber3tid() { return CardsParser.Data.map(row => row['PowerNumber3TID']); }
    static GetPowernumber4tid() { return CardsParser.Data.map(row => row['PowerNumber4TID']); }
    static GetPowericon1exportname() { return CardsParser.Data.map(row => row['PowerIcon1ExportName']); }
    static GetPowericon2exportname() { return CardsParser.Data.map(row => row['PowerIcon2ExportName']); }
    static GetSortorder() { return CardsParser.Data.map(row => row['SortOrder']); }
    static GetDontupgradestat() { return CardsParser.Data.map(row => row['DontUpgradeStat']); }
    static GetHidedamagestat() { return CardsParser.Data.map(row => row['HideDamageStat']); }
    static GetDirectpurchaseprice() { return CardsParser.Data.map(row => row['DirectPurchasePrice']); }
}

export default CardsParser;
