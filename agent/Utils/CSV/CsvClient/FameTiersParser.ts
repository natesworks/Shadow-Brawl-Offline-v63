class FameTiersParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        FameTiersParser.Data = csvData;
    }
    static GetName() { return FameTiersParser.Data.map(row => row['Name']); }
    static GetFametonext() { return FameTiersParser.Data.map(row => row['FameToNext']); }
    static GetGroup() { return FameTiersParser.Data.map(row => row['Group']); }
    static GetTid() { return FameTiersParser.Data.map(row => row['TID']); }
    static GetIconswf() { return FameTiersParser.Data.map(row => row['IconSWF']); }
    static GetIconexportname() { return FameTiersParser.Data.map(row => row['IconExportName']); }
    static GetIconbigexportname() { return FameTiersParser.Data.map(row => row['IconBigExportName']); }
    static GetIconstarsexportname() { return FameTiersParser.Data.map(row => row['IconStarsExportName']); }
    static GetReward() { return FameTiersParser.Data.map(row => row['Reward']); }
    static GetRewardtype() { return FameTiersParser.Data.map(row => row['RewardType']); }
}

export default FameTiersParser;
