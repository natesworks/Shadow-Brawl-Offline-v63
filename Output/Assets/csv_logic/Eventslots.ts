class Eventslots {
    static Brawlballslot = class {
        static Name = "BrawlBallSlot"
        static Slot = 1
        static Trophyworldiconexportpath = "sc/trophy_world_common.sc#reward_item_brawl_ball"
        static RowID = 1
    }
    static Dailyeventsslot = class {
        static Name = "DailyEventsSlot"
        static Slot = 3
        static Trophyworldiconexportpath = "sc/trophy_world_common.sc#reward_item_gem_grab"
        static RowID = 2
    }
    static Teamevents = class {
        static Name = "TeamEvents"
        static Slot = 4
        static Trophyworldiconexportpath = "sc/trophy_world_common.sc#reward_item_team_events"
        static RowID = 3
    }
    static Specialevents = class {
        static Name = "SpecialEvents"
        static Slot = 7
        static Trophyworldiconexportpath = "sc/trophy_world_common.sc#reward_item_special_events"
        static RowID = 4
    }
    static Contest = class {
        static Name = "Contest"
        static Slot = 9
        static RowID = 5
    }
    static Ranked = class {
        static Name = "Ranked"
        static Slot = 14
        static Bgcoloroverride = "0xFFE33A4E"
        static Eventiconoverride = "event_icon_ranked"
        static Trophyworldiconexportpath = "sc/trophy_world_common.sc#reward_item_ranked"
        static RowID = 6
    }
    static Random = class {
        static Name = "Random"
        static Slot = 18
        static Bgcoloroverride = "0xFFFCAB90"
        static Eventiconoverride = "event_icon_random"
        static RowID = 7
    }
    static Mayhem = class {
        static Name = "Mayhem"
        static Slot = 34
        static Bgcoloroverride = "0xFF9304C9"
        static Eventiconoverride = "event_icon_overcharge"
        static RowID = 8
    }
    static Clubpiggy = class {
        static Name = "ClubPiggy"
        static Slot = 35
        static Bgcoloroverride = "0xFFB504B0"
        static Eventiconoverride = "event_icon_clubpiggybank"
        static RowID = 9
    }
    static Mirrormatch = class {
        static Name = "MirrorMatch"
        static Slot = 37
        static RowID = 10
    }
}

export default Eventslots;