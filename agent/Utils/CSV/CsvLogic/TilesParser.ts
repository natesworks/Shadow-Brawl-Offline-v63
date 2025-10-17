class TilesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        TilesParser.Data = csvData;
    }
    static GetName() { return TilesParser.Data.map(row => row['Name']); }
    static GetTilecode() { return TilesParser.Data.map(row => row['TileCode']); }
    static GetDynamiccode() { return TilesParser.Data.map(row => row['DynamicCode']); }
    static GetBlocksmovement() { return TilesParser.Data.map(row => row['BlocksMovement']); }
    static GetBlocksprojectiles() { return TilesParser.Data.map(row => row['BlocksProjectiles']); }
    static GetIsdestructible() { return TilesParser.Data.map(row => row['IsDestructible']); }
    static GetIsdestructiblenormalweapon() { return TilesParser.Data.map(row => row['IsDestructibleNormalWeapon']); }
    static GetIsdestructibleovertime() { return TilesParser.Data.map(row => row['IsDestructibleOvertime']); }
    static GetIsbouncer() { return TilesParser.Data.map(row => row['IsBouncer']); }
    static GetIsforest() { return TilesParser.Data.map(row => row['IsForest']); }
    static GetDamage() { return TilesParser.Data.map(row => row['Damage']); }
    static GetHealth() { return TilesParser.Data.map(row => row['Health']); }
    static GetHealthstates() { return TilesParser.Data.map(row => row['HealthStates']); }
    static GetHealthchangeeffect() { return TilesParser.Data.map(row => row['HealthChangeEffect']); }
    static GetSpeedchange() { return TilesParser.Data.map(row => row['SpeedChange']); }
    static GetRestoreafterdynamicoverlap() { return TilesParser.Data.map(row => row['RestoreAfterDynamicOverlap']); }
    static GetRespawnseconds() { return TilesParser.Data.map(row => row['RespawnSeconds']); }
    static GetCollisionmargin() { return TilesParser.Data.map(row => row['CollisionMargin']); }
    static GetBaseexportname() { return TilesParser.Data.map(row => row['BaseExportName']); }
    static GetBaseexplosioneffect() { return TilesParser.Data.map(row => row['BaseExplosionEffect']); }
    static GetBasehiteffect() { return TilesParser.Data.map(row => row['BaseHitEffect']); }
    static GetBasewindeffect() { return TilesParser.Data.map(row => row['BaseWindEffect']); }
    static GetSortoffset() { return TilesParser.Data.map(row => row['SortOffset']); }
    static GetHashitanim() { return TilesParser.Data.map(row => row['HasHitAnim']); }
    static GetHaswindanim() { return TilesParser.Data.map(row => row['HasWindAnim']); }
    static GetShadowscalex() { return TilesParser.Data.map(row => row['ShadowScaleX']); }
    static GetShadowscaley() { return TilesParser.Data.map(row => row['ShadowScaleY']); }
    static GetShadowx() { return TilesParser.Data.map(row => row['ShadowX']); }
    static GetShadowy() { return TilesParser.Data.map(row => row['ShadowY']); }
    static GetShadowskew() { return TilesParser.Data.map(row => row['ShadowSkew']); }
    static GetLifetime() { return TilesParser.Data.map(row => row['Lifetime']); }
    static GetCustomscw() { return TilesParser.Data.map(row => row['CustomSCW']); }
    static GetCustommesh() { return TilesParser.Data.map(row => row['CustomMesh']); }
    static GetCustomanglestep() { return TilesParser.Data.map(row => row['CustomAngleStep']); }
    static GetMapeditorvisible() { return TilesParser.Data.map(row => row['MapEditorVisible']); }
    static GetMapeditorvisualmode() { return TilesParser.Data.map(row => row['MapEditorVisualMode']); }
    static GetMapeditorconnected() { return TilesParser.Data.map(row => row['MapEditorConnected']); }
    static GetSpawneffect() { return TilesParser.Data.map(row => row['SpawnEffect']); }
}

export default TilesParser;
