class EmotesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        EmotesParser.Data = csvData;
    }
    static GetName() { return EmotesParser.Data.map(row => row['Name']); }
    static GetDisabled() { return EmotesParser.Data.map(row => row['Disabled']); }
    static GetDisabledcn() { return EmotesParser.Data.map(row => row['DisabledCN']); }
    static GetIconswf() { return EmotesParser.Data.map(row => row['IconSWF']); }
    static GetIconexportname() { return EmotesParser.Data.map(row => row['IconExportName']); }
    static GetCharacter() { return EmotesParser.Data.map(row => row['Character']); }
    static GetSkin() { return EmotesParser.Data.map(row => row['Skin']); }
    static GetGiveonskinunlock() { return EmotesParser.Data.map(row => row['GiveOnSkinUnlock']); }
    static GetIspicto() { return EmotesParser.Data.map(row => row['IsPicto']); }
    static GetBattlecategory() { return EmotesParser.Data.map(row => row['BattleCategory']); }
    static GetRarity() { return EmotesParser.Data.map(row => row['Rarity']); }
    static GetEmotetype() { return EmotesParser.Data.map(row => row['EmoteType']); }
    static GetSoundeffect() { return EmotesParser.Data.map(row => row['SoundEffect']); }
    static GetSfxindex() { return EmotesParser.Data.map(row => row['SfxIndex']); }
    static GetLockedforchronos() { return EmotesParser.Data.map(row => row['LockedForChronos']); }
    static GetEmotebundles() { return EmotesParser.Data.map(row => row['EmoteBundles']); }
    static GetIsdefaultbattleemote() { return EmotesParser.Data.map(row => row['IsDefaultBattleEmote']); }
    static GetPricebling() { return EmotesParser.Data.map(row => row['PriceBling']); }
    static GetPricegems() { return EmotesParser.Data.map(row => row['PriceGems']); }
    static GetDisablecatalogrelease() { return EmotesParser.Data.map(row => row['DisableCatalogRelease']); }
    static GetCatalognewdaysadjustment() { return EmotesParser.Data.map(row => row['CatalogNewDaysAdjustment']); }
    static GetNotincatalogtid() { return EmotesParser.Data.map(row => row['NotInCatalogTID']); }
    static GetExtracatalogcampaign() { return EmotesParser.Data.map(row => row['ExtraCatalogCampaign']); }
    static GetHidefromcatalograritycategory() { return EmotesParser.Data.map(row => row['HideFromCatalogRarityCategory']); }
    static GetUnlockedbyfame() { return EmotesParser.Data.map(row => row['UnlockedByFame']); }
}

export default EmotesParser;
