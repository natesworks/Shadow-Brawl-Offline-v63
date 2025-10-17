class BrawlerEarlyAccessParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        BrawlerEarlyAccessParser.Data = csvData;
    }
    static GetName() { return BrawlerEarlyAccessParser.Data.map(row => row['Name']); }
    static GetHero() { return BrawlerEarlyAccessParser.Data.map(row => row['Hero']); }
    static GetTicketiconexportpath() { return BrawlerEarlyAccessParser.Data.map(row => row['TicketIconExportPath']); }
    static GetInfoflow() { return BrawlerEarlyAccessParser.Data.map(row => row['InfoFlow']); }
    static GetEventinfoflow() { return BrawlerEarlyAccessParser.Data.map(row => row['EventInfoFlow']); }
    static GetBrawlerboxrewardcontainer() { return BrawlerEarlyAccessParser.Data.map(row => row['BrawlerBoxRewardContainer']); }
    static GetTitletid() { return BrawlerEarlyAccessParser.Data.map(row => row['TitleTID']); }
    static GetSubtitletid() { return BrawlerEarlyAccessParser.Data.map(row => row['SubtitleTID']); }
    static GetBoxicon() { return BrawlerEarlyAccessParser.Data.map(row => row['BoxIcon']); }
    static GetHeroframelabel() { return BrawlerEarlyAccessParser.Data.map(row => row['HeroFrameLabel']); }
    static GetBoxstampinstancename() { return BrawlerEarlyAccessParser.Data.map(row => row['BoxStampInstanceName']); }
    static GetEventicon() { return BrawlerEarlyAccessParser.Data.map(row => row['EventIcon']); }
    static GetChatsuggestionitem() { return BrawlerEarlyAccessParser.Data.map(row => row['ChatSuggestionItem']); }
    static GetGamemoderoomicon() { return BrawlerEarlyAccessParser.Data.map(row => row['GameModeRoomIcon']); }
    static GetBoxidle3danimstart() { return BrawlerEarlyAccessParser.Data.map(row => row['BoxIdle3DAnimStart']); }
    static GetBoxidle3danimend() { return BrawlerEarlyAccessParser.Data.map(row => row['BoxIdle3DAnimEnd']); }
    static GetBoxrotations() { return BrawlerEarlyAccessParser.Data.map(row => row['BoxRotations']); }
    static GetBoxstartframeoffsets() { return BrawlerEarlyAccessParser.Data.map(row => row['BoxStartFrameOffsets']); }
    static GetGachabgexportpath() { return BrawlerEarlyAccessParser.Data.map(row => row['GachaBgExportPath']); }
}

export default BrawlerEarlyAccessParser;
