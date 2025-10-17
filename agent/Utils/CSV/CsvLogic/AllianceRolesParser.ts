class AllianceRolesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        AllianceRolesParser.Data = csvData;
    }
    static GetName() { return AllianceRolesParser.Data.map(row => row['Name']); }
    static GetLevel() { return AllianceRolesParser.Data.map(row => row['Level']); }
    static GetTid() { return AllianceRolesParser.Data.map(row => row['TID']); }
    static GetCaninvite() { return AllianceRolesParser.Data.map(row => row['CanInvite']); }
    static GetCansendmail() { return AllianceRolesParser.Data.map(row => row['CanSendMail']); }
    static GetCanchangealliancesettings() { return AllianceRolesParser.Data.map(row => row['CanChangeAllianceSettings']); }
    static GetCanacceptjoinrequest() { return AllianceRolesParser.Data.map(row => row['CanAcceptJoinRequest']); }
    static GetCankick() { return AllianceRolesParser.Data.map(row => row['CanKick']); }
    static GetCanbepromotedtoleader() { return AllianceRolesParser.Data.map(row => row['CanBePromotedToLeader']); }
    static GetPromoteskill() { return AllianceRolesParser.Data.map(row => row['PromoteSkill']); }
}

export default AllianceRolesParser;
