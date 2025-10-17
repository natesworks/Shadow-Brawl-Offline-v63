class CatalogCollectionsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        CatalogCollectionsParser.Data = csvData;
    }
    static GetName() { return CatalogCollectionsParser.Data.map(row => row['Name']); }
    static GetDisabled() { return CatalogCollectionsParser.Data.map(row => row['Disabled']); }
    static GetSortorder() { return CatalogCollectionsParser.Data.map(row => row['SortOrder']); }
    static GetCollectiontype() { return CatalogCollectionsParser.Data.map(row => row['CollectionType']); }
    static GetRarities() { return CatalogCollectionsParser.Data.map(row => row['Rarities']); }
    static GetCatalogiconexportname() { return CatalogCollectionsParser.Data.map(row => row['CatalogIconExportName']); }
    static GetNametid() { return CatalogCollectionsParser.Data.map(row => row['NameTID']); }
    static GetCatalogdescriptiontid() { return CatalogCollectionsParser.Data.map(row => row['CatalogDescriptionTID']); }
    static GetScalefactor() { return CatalogCollectionsParser.Data.map(row => row['ScaleFactor']); }
}

export default CatalogCollectionsParser;
