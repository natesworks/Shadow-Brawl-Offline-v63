class Introflows {
    static Trophyseasonboxinfo = class {
        static Name = "TrophySeasonBoxInfo"
        static Containerassetpathprefix = "trophy_season_box_info_screen_"
        static Componenttypes = "SEASON_BOX_PROGRESS"
        static Componentnames = "blingbox_progress"
        static RowID = 1
    }
    static Row2 = class {
        static Componenttypes = "SEASON_BOX_LEVELS"
        static RowID = 2
    }
    static Row3 = class {
        static Componenttypes = "TOOLTIP_BUTTON"
        static Componentnames = "info_button"
        static Componenttids = "TID_SEASON_BOX_INFO_POPUP_TOOLTIP"
        static RowID = 3
    }
    static Seasonboxintro = class {
        static Name = "SeasonBoxIntro"
        static Containerassetpathprefix = "season_box_info_screen_"
        static Idlestopframename = "idle"
        static RowID = 4
    }
    static Clubpiggyxmasreskininfo = class {
        static Name = "ClubPiggyXmasReskinInfo"
        static Containerassetpathprefix = "club_piggy_bank_info_screen_"
        static Notsetseen = true
        static Requiredscassetid = "ClubPiggyXmasReskinSc"
        static RowID = 5
    }
    static Clubpiggytunainfo = class {
        static Name = "ClubPiggyTunaInfo"
        static Containerassetpathprefix = "club_piggy_bank_info_screen_"
        static Notsetseen = true
        static Requiredscassetid = "ClubPiggyTunaSC"
        static RowID = 6
    }
    static Clubpiggysubwayinfo = class {
        static Name = "ClubPiggySubwayInfo"
        static Containerassetpathprefix = "club_piggy_bank_info_screen_"
        static Notsetseen = true
        static Requiredscassetid = "ClubPiggySubwaySC"
        static RowID = 7
    }
    static Dancerearlyaccessinfo = class {
        static Name = "DancerEarlyAccessInfo"
        static Containerassetpathprefix = "sc/ui_brawler_event.sc#mina_early_access_info_screen_"
        static Componenttypes = "SKIN"
        static Componentnames = "max_rewards/hero_item"
        static Componentstringvalues = "DancerDefault"
        static Notsetseen = true
        static RowID = 8
    }
    static Dancerearlyaccesseventinfo = class {
        static Name = "DancerEarlyAccessEventInfo"
        static Containerassetpathprefix = "sc/ui_brawler_event.sc#event_mina_early_access_info_screen_"
        static Notsetseen = true
        static RowID = 9
    }
    static Furyearlyaccessinfo = class {
        static Name = "FuryEarlyAccessInfo"
        static Containerassetpathprefix = "sc/ui_brawler_event.sc#ziggy_early_access_info_screen_"
        static Componenttypes = "SKIN"
        static Componentnames = "max_rewards/hero_item"
        static Componentstringvalues = "FuryDefault"
        static Notsetseen = true
        static RowID = 10
    }
    static Furyearlyaccesseventinfo = class {
        static Name = "FuryEarlyAccessEventInfo"
        static Containerassetpathprefix = "sc/ui_brawler_event.sc#event_ziggy_early_access_info_screen_"
        static Notsetseen = true
        static RowID = 11
    }
}

export default Introflows;