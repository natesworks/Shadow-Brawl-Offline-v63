class ItemsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ItemsParser.Data = csvData;
    }
    static GetName() { return ItemsParser.Data.map(row => row['Name']); }
    static GetParentitemforskin() { return ItemsParser.Data.map(row => row['ParentItemForSkin']); }
    static GetDisabled() { return ItemsParser.Data.map(row => row['Disabled']); }
    static GetFilename() { return ItemsParser.Data.map(row => row['FileName']); }
    static GetExportname() { return ItemsParser.Data.map(row => row['ExportName']); }
    static GetExportnameenemy() { return ItemsParser.Data.map(row => row['ExportNameEnemy']); }
    static GetShadowexportname() { return ItemsParser.Data.map(row => row['ShadowExportName']); }
    static GetGroundglowexportname() { return ItemsParser.Data.map(row => row['GroundGlowExportName']); }
    static GetLoopingeffect() { return ItemsParser.Data.map(row => row['LoopingEffect']); }
    static GetAligntotiles() { return ItemsParser.Data.map(row => row['AlignToTiles']); }
    static GetValue() { return ItemsParser.Data.map(row => row['Value']); }
    static GetValue2() { return ItemsParser.Data.map(row => row['Value2']); }
    static GetValue3() { return ItemsParser.Data.map(row => row['Value3']); }
    static GetLifetime() { return ItemsParser.Data.map(row => row['Lifetime']); }
    static GetStatuseffectally() { return ItemsParser.Data.map(row => row['StatusEffectAlly']); }
    static GetStatuseffectenemy() { return ItemsParser.Data.map(row => row['StatusEffectEnemy']); }
    static GetDisappearingtime() { return ItemsParser.Data.map(row => row['DisappearingTime']); }
    static GetTriggerrangesubtiles() { return ItemsParser.Data.map(row => row['TriggerRangeSubTiles']); }
    static GetTriggerareaeffect() { return ItemsParser.Data.map(row => row['TriggerAreaEffect']); }
    static GetDestroyareaeffect() { return ItemsParser.Data.map(row => row['DestroyAreaEffect']); }
    static GetCanbepickedup() { return ItemsParser.Data.map(row => row['CanBePickedUp']); }
    static GetPickuponlybysource() { return ItemsParser.Data.map(row => row['PickUpOnlyBySource']); }
    static GetFollowsourcedimension() { return ItemsParser.Data.map(row => row['FollowSourceDimension']); }
    static GetSpawneffect() { return ItemsParser.Data.map(row => row['SpawnEffect']); }
    static GetActivateeffect() { return ItemsParser.Data.map(row => row['ActivateEffect']); }
    static GetScw() { return ItemsParser.Data.map(row => row['SCW']); }
    static GetScwenemy() { return ItemsParser.Data.map(row => row['SCWEnemy']); }
    static GetScwtoplayer() { return ItemsParser.Data.map(row => row['SCWTopLayer']); }
    static GetUsegeneratedshadow() { return ItemsParser.Data.map(row => row['UseGeneratedShadow']); }
    static GetShowalways() { return ItemsParser.Data.map(row => row['ShowAlways']); }
    static GetRandomstartframe() { return ItemsParser.Data.map(row => row['RandomStartFrame']); }
    static GetLayer() { return ItemsParser.Data.map(row => row['Layer']); }
    static GetItemclip() { return ItemsParser.Data.map(row => row['ItemClip']); }
    static GetItemreadyeffect() { return ItemsParser.Data.map(row => row['ItemReadyEffect']); }
    static GetCustomareaeffect1() { return ItemsParser.Data.map(row => row['CustomAreaEffect1']); }
    static GetCustomareaeffect2() { return ItemsParser.Data.map(row => row['CustomAreaEffect2']); }
}

export default ItemsParser;
