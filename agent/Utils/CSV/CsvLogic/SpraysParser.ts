class SpraysParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        SpraysParser.Data = csvData;
    }
    static GetName() { return SpraysParser.Data.map(row => row['Name']); }
    static GetDisabled() { return SpraysParser.Data.map(row => row['Disabled']); }
    static GetDisabledcn() { return SpraysParser.Data.map(row => row['DisabledCN']); }
    static GetFilename() { return SpraysParser.Data.map(row => row['FileName']); }
    static GetExportname() { return SpraysParser.Data.map(row => row['ExportName']); }
    static GetCharacter() { return SpraysParser.Data.map(row => row['Character']); }
    static GetSkin() { return SpraysParser.Data.map(row => row['Skin']); }
    static GetGiveonskinunlock() { return SpraysParser.Data.map(row => row['GiveOnSkinUnlock']); }
    static GetRarity() { return SpraysParser.Data.map(row => row['Rarity']); }
    static GetEffectcolorr() { return SpraysParser.Data.map(row => row['EffectColorR']); }
    static GetEffectcolorg() { return SpraysParser.Data.map(row => row['EffectColorG']); }
    static GetEffectcolorb() { return SpraysParser.Data.map(row => row['EffectColorB']); }
    static GetFlipsprayforenemies() { return SpraysParser.Data.map(row => row['FlipSprayForEnemies']); }
    static GetLockedforchronos() { return SpraysParser.Data.map(row => row['LockedForChronos']); }
    static GetSpraybundles() { return SpraysParser.Data.map(row => row['SprayBundles']); }
    static GetIsdefaultbattlespray() { return SpraysParser.Data.map(row => row['IsDefaultBattleSpray']); }
    static GetTexture() { return SpraysParser.Data.map(row => row['Texture']); }
    static GetPricebling() { return SpraysParser.Data.map(row => row['PriceBling']); }
    static GetPricegems() { return SpraysParser.Data.map(row => row['PriceGems']); }
    static GetDisablecatalogrelease() { return SpraysParser.Data.map(row => row['DisableCatalogRelease']); }
    static GetCatalognewdaysadjustment() { return SpraysParser.Data.map(row => row['CatalogNewDaysAdjustment']); }
    static GetNotincatalogtid() { return SpraysParser.Data.map(row => row['NotInCatalogTID']); }
    static GetUseshinevfx() { return SpraysParser.Data.map(row => row['UseShineVFX']); }
    static GetExtracatalogcampaign() { return SpraysParser.Data.map(row => row['ExtraCatalogCampaign']); }
    static GetHidefromcatalogmaincategory() { return SpraysParser.Data.map(row => row['HideFromCatalogMainCategory']); }
    static GetDisablefromcatalogifnotowned() { return SpraysParser.Data.map(row => row['DisableFromCatalogIfNotOwned']); }
}

export default SpraysParser;
