class CompetitivePassTiersParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        CompetitivePassTiersParser.Data = csvData;
    }
    static GetName() { return CompetitivePassTiersParser.Data.map(row => row['Name']); }
    static GetType() { return CompetitivePassTiersParser.Data.map(row => row['Type']); }
    static GetIndex() { return CompetitivePassTiersParser.Data.map(row => row['Index']); }
    static GetProgressstart() { return CompetitivePassTiersParser.Data.map(row => row['ProgressStart']); }
    static GetProgress() { return CompetitivePassTiersParser.Data.map(row => row['Progress']); }
    static GetSeason() { return CompetitivePassTiersParser.Data.map(row => row['Season']); }
    static GetPrimaryrewardtype() { return CompetitivePassTiersParser.Data.map(row => row['PrimaryRewardType']); }
    static GetPrimaryrewardcount() { return CompetitivePassTiersParser.Data.map(row => row['PrimaryRewardCount']); }
    static GetPrimaryrewardextradata() { return CompetitivePassTiersParser.Data.map(row => row['PrimaryRewardExtraData']); }
    static GetPrimaryrewarddata() { return CompetitivePassTiersParser.Data.map(row => row['PrimaryRewardData']); }
    static GetSecondaryrewardtype() { return CompetitivePassTiersParser.Data.map(row => row['SecondaryRewardType']); }
    static GetSecondaryrewardcount() { return CompetitivePassTiersParser.Data.map(row => row['SecondaryRewardCount']); }
    static GetSecondaryrewardextradata() { return CompetitivePassTiersParser.Data.map(row => row['SecondaryRewardExtraData']); }
    static GetSecondaryrewarddata() { return CompetitivePassTiersParser.Data.map(row => row['SecondaryRewardData']); }
}

export default CompetitivePassTiersParser;
