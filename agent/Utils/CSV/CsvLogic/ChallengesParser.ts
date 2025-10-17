class ChallengesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ChallengesParser.Data = csvData;
    }
    static GetName() { return ChallengesParser.Data.map(row => row['Name']); }
    static GetDisabled() { return ChallengesParser.Data.map(row => row['Disabled']); }
    static GetChallengeid() { return ChallengesParser.Data.map(row => row['ChallengeId']); }
    static GetFilename() { return ChallengesParser.Data.map(row => row['FileName']); }
    static GetLocale() { return ChallengesParser.Data.map(row => row['Locale']); }
    static GetLogoasset() { return ChallengesParser.Data.map(row => row['LogoAsset']); }
    static GetHomescreenlogo() { return ChallengesParser.Data.map(row => row['HomeScreenLogo']); }
    static GetEventasset() { return ChallengesParser.Data.map(row => row['EventAsset']); }
    static GetEventassetsmall() { return ChallengesParser.Data.map(row => row['EventAssetSmall']); }
    static GetChatitem() { return ChallengesParser.Data.map(row => row['ChatItem']); }
    static GetRewarditem() { return ChallengesParser.Data.map(row => row['RewardItem']); }
    static GetRewardunlockeditem() { return ChallengesParser.Data.map(row => row['RewardUnlockedItem']); }
    static GetAttemptsrewardanimation() { return ChallengesParser.Data.map(row => row['AttemptsRewardAnimation']); }
    static GetHeaderframe() { return ChallengesParser.Data.map(row => row['HeaderFrame']); }
    static GetTid() { return ChallengesParser.Data.map(row => row['TID']); }
    static GetStagetid() { return ChallengesParser.Data.map(row => row['StageTID']); }
    static GetRewardtid() { return ChallengesParser.Data.map(row => row['RewardTID']); }
    static GetCompletedtid() { return ChallengesParser.Data.map(row => row['CompletedTID']); }
    static GetMilestonerewardpopuptid() { return ChallengesParser.Data.map(row => row['MilestoneRewardPopupTID']); }
    static GetFallbackmilestonerewardpopuptid() { return ChallengesParser.Data.map(row => row['FallbackMilestoneRewardPopupTID']); }
    static GetCompletionrewardpopuptid() { return ChallengesParser.Data.map(row => row['CompletionRewardPopupTID']); }
    static GetFallbackcompletionrewardpopuptid() { return ChallengesParser.Data.map(row => row['FallbackCompletionRewardPopupTID']); }
    static GetBattleendheadertid() { return ChallengesParser.Data.map(row => row['BattleEndHeaderTID']); }
    static GetBattleendwinlabeltid() { return ChallengesParser.Data.map(row => row['BattleEndWinLabelTID']); }
    static GetBattleendwintid() { return ChallengesParser.Data.map(row => row['BattleEndWinTID']); }
    static GetStartnotification() { return ChallengesParser.Data.map(row => row['StartNotification']); }
    static GetRemindernotification() { return ChallengesParser.Data.map(row => row['ReminderNotification']); }
    static GetTeasertitletid() { return ChallengesParser.Data.map(row => row['TeaserTitleTID']); }
    static GetTeaserinfotid() { return ChallengesParser.Data.map(row => row['TeaserInfoTID']); }
    static GetRewardskin() { return ChallengesParser.Data.map(row => row['RewardSkin']); }
    static GetRewardpopuptid() { return ChallengesParser.Data.map(row => row['RewardPopupTID']); }
}

export default ChallengesParser;
