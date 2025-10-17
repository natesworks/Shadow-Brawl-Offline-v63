class CollabGameModesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        CollabGameModesParser.Data = csvData;
    }
    static GetName() { return CollabGameModesParser.Data.map(row => row['Name']); }
    static GetCollab() { return CollabGameModesParser.Data.map(row => row['Collab']); }
    static GetContest() { return CollabGameModesParser.Data.map(row => row['Contest']); }
    static GetEventslot() { return CollabGameModesParser.Data.map(row => row['EventSlot']); }
    static GetExtendedspecialeventhero() { return CollabGameModesParser.Data.map(row => row['ExtendedSpecialEventHero']); }
    static GetGamemodevariation() { return CollabGameModesParser.Data.map(row => row['GameModeVariation']); }
    static GetEventmodifier() { return CollabGameModesParser.Data.map(row => row['EventModifier']); }
    static GetClipoverrideswf() { return CollabGameModesParser.Data.map(row => row['ClipOverrideSWF']); }
    static GetClipoverrideexportname() { return CollabGameModesParser.Data.map(row => row['ClipOverrideExportName']); }
    static GetModeoverrideswf() { return CollabGameModesParser.Data.map(row => row['ModeOverrideSWF']); }
    static GetModeoverrideiconname() { return CollabGameModesParser.Data.map(row => row['ModeOverrideIconName']); }
    static GetModeoverrideroomiconname() { return CollabGameModesParser.Data.map(row => row['ModeOverrideRoomIconName']); }
    static GetModeoverrideroomframelabel() { return CollabGameModesParser.Data.map(row => row['ModeOverrideRoomFrameLabel']); }
    static GetBanneroverrideswf() { return CollabGameModesParser.Data.map(row => row['BannerOverrideSWF']); }
    static GetBanneroverrideexportname() { return CollabGameModesParser.Data.map(row => row['BannerOverrideExportName']); }
    static GetModebigcoverswf() { return CollabGameModesParser.Data.map(row => row['ModeBigCoverSWF']); }
    static GetModebigcoverexportname() { return CollabGameModesParser.Data.map(row => row['ModeBigCoverExportName']); }
    static GetHidedefaulttextsfrombanner() { return CollabGameModesParser.Data.map(row => row['HideDefaultTextsFromBanner']); }
    static GetHidedefaulttimefrombanner() { return CollabGameModesParser.Data.map(row => row['HideDefaultTimeFromBanner']); }
    static GetHidegamemodegraphicswhiletall() { return CollabGameModesParser.Data.map(row => row['HideGameModeGraphicsWhileTall']); }
    static GetIdleframelabel() { return CollabGameModesParser.Data.map(row => row['IdleFrameLabel']); }
}

export default CollabGameModesParser;
