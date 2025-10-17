class SkinsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        SkinsParser.Data = csvData;
    }
    static GetName() { return SkinsParser.Data.map(row => row['Name']); }
    static GetConf() { return SkinsParser.Data.map(row => row['Conf']); }
    static GetDisabled() { return SkinsParser.Data.map(row => row['Disabled']); }
    static GetCampaigns() { return SkinsParser.Data.map(row => row['Campaigns']); }
    static GetUpdatenumber() { return SkinsParser.Data.map(row => row['UpdateNumber']); }
    static GetIconoverrideswf() { return SkinsParser.Data.map(row => row['IconOverrideSWF']); }
    static GetIconoverrideexportname() { return SkinsParser.Data.map(row => row['IconOverrideExportName']); }
    static GetSkingroupid() { return SkinsParser.Data.map(row => row['SkinGroupId']); }
    static GetObtaintype() { return SkinsParser.Data.map(row => row['ObtainType']); }
    static GetObtaintypecn() { return SkinsParser.Data.map(row => row['ObtainTypeCN']); }
    static GetLastchance() { return SkinsParser.Data.map(row => row['LastChance']); }
    static GetMasterskin() { return SkinsParser.Data.map(row => row['MasterSkin']); }
    static GetProgressionskinbase() { return SkinsParser.Data.map(row => row['ProgressionSkinBase']); }
    static GetProgressionskinlevel() { return SkinsParser.Data.map(row => row['ProgressionSkinLevel']); }
    static GetProgressionskinfinal() { return SkinsParser.Data.map(row => row['ProgressionSkinFinal']); }
    static GetPetskin() { return SkinsParser.Data.map(row => row['PetSkin']); }
    static GetPetskin2() { return SkinsParser.Data.map(row => row['PetSkin2']); }
    static GetPriceclubcoins() { return SkinsParser.Data.map(row => row['PriceClubCoins']); }
    static GetPricestarpoints() { return SkinsParser.Data.map(row => row['PriceStarPoints']); }
    static GetPricebling() { return SkinsParser.Data.map(row => row['PriceBling']); }
    static GetCandropwithoutblingprice() { return SkinsParser.Data.map(row => row['CanDropWithoutBlingPrice']); }
    static GetPricegems() { return SkinsParser.Data.map(row => row['PriceGems']); }
    static GetDiscountpricegems() { return SkinsParser.Data.map(row => row['DiscountPriceGems']); }
    static GetPricecoins() { return SkinsParser.Data.map(row => row['PriceCoins']); }
    static GetRarity() { return SkinsParser.Data.map(row => row['Rarity']); }
    static GetTid() { return SkinsParser.Data.map(row => row['TID']); }
    static GetShoptid() { return SkinsParser.Data.map(row => row['ShopTID']); }
    static GetFeatures() { return SkinsParser.Data.map(row => row['Features']); }
    static GetCommunitycredit() { return SkinsParser.Data.map(row => row['CommunityCredit']); }
    static GetMaterialsfile() { return SkinsParser.Data.map(row => row['MaterialsFile']); }
    static GetDiffusetexture() { return SkinsParser.Data.map(row => row['DiffuseTexture']); }
    static GetSpeculartexture() { return SkinsParser.Data.map(row => row['SpecularTexture']); }
    static GetOutlineshader() { return SkinsParser.Data.map(row => row['OutlineShader']); }
    static GetPackofferanimoverride() { return SkinsParser.Data.map(row => row['PackOfferAnimOverride']); }
    static GetBattleintroxoffset() { return SkinsParser.Data.map(row => row['BattleIntroXOffset']); }
    static GetBattleintrozoffset() { return SkinsParser.Data.map(row => row['BattleIntroZOffset']); }
    static GetBattleintrovfx() { return SkinsParser.Data.map(row => row['BattleIntroVFX']); }
    static GetDisablecatalogrelease() { return SkinsParser.Data.map(row => row['DisableCatalogRelease']); }
    static GetCatalogprerequirementskin() { return SkinsParser.Data.map(row => row['CatalogPreRequirementSkin']); }
    static GetCatalognewdaysadjustment() { return SkinsParser.Data.map(row => row['CatalogNewDaysAdjustment']); }
    static GetNotincatalogtid() { return SkinsParser.Data.map(row => row['NotInCatalogTID']); }
    static GetPrecisecollision() { return SkinsParser.Data.map(row => row['PreciseCollision']); }
}

export default SkinsParser;
