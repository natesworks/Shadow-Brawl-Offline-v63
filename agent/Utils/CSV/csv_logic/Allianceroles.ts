class Allianceroles {
    static Nonmember = class {
        static Name = "NonMember"
        static Level = 0
        static Caninvite = false
        static Cansendmail = false
        static Canchangealliancesettings = false
        static Canacceptjoinrequest = false
        static Promoteskill = 0
        static RowID = 1
    }
    static Member = class {
        static Name = "Member"
        static Level = 1
        static Tid = "TID_ALLIANCE_ROLE_MEMBER"
        static Caninvite = false
        static Cansendmail = false
        static Canchangealliancesettings = false
        static Canacceptjoinrequest = false
        static Cankick = false
        static Promoteskill = 0
        static RowID = 2
    }
    static Leader = class {
        static Name = "Leader"
        static Level = 20
        static Tid = "TID_ALLIANCE_ROLE_LEADER"
        static Caninvite = true
        static Cansendmail = true
        static Canchangealliancesettings = true
        static Canacceptjoinrequest = true
        static Cankick = true
        static Canbepromotedtoleader = true
        static Promoteskill = 2
        static RowID = 3
    }
    static Elder = class {
        static Name = "Elder"
        static Level = 5
        static Tid = "TID_ALLIANCE_ROLE_ELDER"
        static Caninvite = true
        static Cansendmail = false
        static Canchangealliancesettings = false
        static Canacceptjoinrequest = true
        static Cankick = true
        static Promoteskill = 0
        static RowID = 4
    }
    static Coleader = class {
        static Name = "Co-leader"
        static Level = 10
        static Tid = "TID_ALLIANCE_ROLE_CO_LEADER"
        static Caninvite = true
        static Cansendmail = true
        static Canchangealliancesettings = true
        static Canacceptjoinrequest = true
        static Cankick = true
        static Canbepromotedtoleader = true
        static Promoteskill = 2
        static RowID = 5
    }
}

export default Allianceroles;