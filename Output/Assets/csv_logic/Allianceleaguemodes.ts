class Allianceleaguemodes {
    static Standard = class {
        static Name = "Standard"
        static Eventslot = 16
        static Previewtickets = 1
        static Previewmaxwin = 4
        static RowID = 1
    }
    static Competitive = class {
        static Name = "Competitive"
        static Eventslot = 17
        static Modeoverrideiconname = "event_icon_clubleague"
        static Modeoverrideroomiconname = "event_gameroom_clubleague"
        static Banneroverrideswf = "sc/events.sc"
        static Banneroverrideexportname = "event_power_match_banner"
        static Eventteasebgcoloroverride = "0xFFEE1B39"
        static Previewtickets = 2
        static Previewmaxwin = 9
        static RowID = 2
    }
}

export default Allianceleaguemodes;