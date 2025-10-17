class GearBoostsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        GearBoostsParser.Data = csvData;
    }
    static GetName() { return GearBoostsParser.Data.map(row => row['Name']); }
    static GetRarity() { return GearBoostsParser.Data.map(row => row['Rarity']); }
    static GetExtraherosavailableto() { return GearBoostsParser.Data.map(row => row['ExtraHerosAvailableTo']); }
    static GetLogictype() { return GearBoostsParser.Data.map(row => row['LogicType']); }
    static GetModifiervalue() { return GearBoostsParser.Data.map(row => row['ModifierValue']); }
    static GetModifiertype() { return GearBoostsParser.Data.map(row => row['ModifierType']); }
    static GetOldtokenresource() { return GearBoostsParser.Data.map(row => row['OldTokenResource']); }
    static GetIconswf() { return GearBoostsParser.Data.map(row => row['IconSWF']); }
    static GetIconexportname() { return GearBoostsParser.Data.map(row => row['IconExportName']); }
    static GetTid() { return GearBoostsParser.Data.map(row => row['TID']); }
    static GetInfotid() { return GearBoostsParser.Data.map(row => row['InfoTID']); }
    static GetUpgradeinfotid() { return GearBoostsParser.Data.map(row => row['UpgradeInfoTID']); }
    static GetUpgradetargettid() { return GearBoostsParser.Data.map(row => row['UpgradeTargetTID']); }
}

export default GearBoostsParser;
