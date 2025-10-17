class ClubPiggyTypesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ClubPiggyTypesParser.Data = csvData;
    }
    static GetName() { return ClubPiggyTypesParser.Data.map(row => row['Name']); }
    static GetDisabled() { return ClubPiggyTypesParser.Data.map(row => row['Disabled']); }
    static GetWintracktype() { return ClubPiggyTypesParser.Data.map(row => row['WinTrackType']); }
    static GetDroptype() { return ClubPiggyTypesParser.Data.map(row => row['DropType']); }
    static GetIsdefaulttypepiggy() { return ClubPiggyTypesParser.Data.map(row => row['IsDefaultTypePiggy']); }
    static GetRewardcontainer() { return ClubPiggyTypesParser.Data.map(row => row['RewardContainer']); }
    static GetUseperplayerrewards() { return ClubPiggyTypesParser.Data.map(row => row['UsePerPlayerRewards']); }
    static GetClaimablemidevent() { return ClubPiggyTypesParser.Data.map(row => row['ClaimableMidEvent']); }
    static GetSkipsummaryafterrewards() { return ClubPiggyTypesParser.Data.map(row => row['SkipSummaryAfterRewards']); }
    static GetNexteventtid() { return ClubPiggyTypesParser.Data.map(row => row['NextEventTID']); }
    static GetReskinassetid() { return ClubPiggyTypesParser.Data.map(row => row['ReskinAssetId']); }
    static GetCustomintroflow() { return ClubPiggyTypesParser.Data.map(row => row['CustomIntroFlow']); }
    static GetRequirecustomintroflowasset() { return ClubPiggyTypesParser.Data.map(row => row['RequireCustomIntroFlowAsset']); }
    static GetEventovertid() { return ClubPiggyTypesParser.Data.map(row => row['EventOverTID']); }
    static GetSmashtid() { return ClubPiggyTypesParser.Data.map(row => row['SmashTID']); }
    static GetLeaderboardtabtid() { return ClubPiggyTypesParser.Data.map(row => row['LeaderboardTabTID']); }
    static GetContributedwinstid() { return ClubPiggyTypesParser.Data.map(row => row['ContributedWinsTID']); }
    static GetNotcontributedwinstid() { return ClubPiggyTypesParser.Data.map(row => row['NotContributedWinsTID']); }
    static GetTickettooltiptid() { return ClubPiggyTypesParser.Data.map(row => row['TicketTooltipTID']); }
    static GetEventnametid() { return ClubPiggyTypesParser.Data.map(row => row['EventNameTID']); }
    static GetEventendinboxtid() { return ClubPiggyTypesParser.Data.map(row => row['EventEndInboxTID']); }
    static GetEventendnounclaimedrewardsinboxtid() { return ClubPiggyTypesParser.Data.map(row => row['EventEndNoUnclaimedRewardsInboxTID']); }
    static GetRewardsrootclippath() { return ClubPiggyTypesParser.Data.map(row => row['RewardsRootClipPath']); }
    static GetRewardclipprefix() { return ClubPiggyTypesParser.Data.map(row => row['RewardClipPrefix']); }
    static GetClaimedrewardsrootclippath() { return ClubPiggyTypesParser.Data.map(row => row['ClaimedRewardsRootClipPath']); }
    static GetClaimedrewardclipprefix() { return ClubPiggyTypesParser.Data.map(row => row['ClaimedRewardClipPrefix']); }
    static GetClaimbuttonclippath() { return ClubPiggyTypesParser.Data.map(row => row['ClaimButtonClipPath']); }
    static GetComponenttypes() { return ClubPiggyTypesParser.Data.map(row => row['ComponentTypes']); }
    static GetComponentvalues() { return ClubPiggyTypesParser.Data.map(row => row['ComponentValues']); }
    static GetNoninteractiveitempaths() { return ClubPiggyTypesParser.Data.map(row => row['NonInteractiveItemPaths']); }
    static GetSoundplayerclippaths() { return ClubPiggyTypesParser.Data.map(row => row['SoundPlayerClipPaths']); }
    static GetRemoveallexceptoneclipwithprefix() { return ClubPiggyTypesParser.Data.map(row => row['RemoveAllExceptOneClipWithPrefix']); }
    static GetMaxscalewinpips() { return ClubPiggyTypesParser.Data.map(row => row['MaxScaleWinPips']); }
    static GetNewticketstid() { return ClubPiggyTypesParser.Data.map(row => row['NewTicketsTID']); }
    static GetWinstonextdroptid() { return ClubPiggyTypesParser.Data.map(row => row['WinsToNextDropTID']); }
    static GetWinstonextdroppopuptid() { return ClubPiggyTypesParser.Data.map(row => row['WinsToNextDropPopupTID']); }
    static GetWinstonextdropgradient() { return ClubPiggyTypesParser.Data.map(row => row['WinsToNextDropGradient']); }
    static GetLevelcountertid() { return ClubPiggyTypesParser.Data.map(row => row['LevelCounterTID']); }
    static GetLevelcounteroverridetidformat() { return ClubPiggyTypesParser.Data.map(row => row['LevelCounterOverrideTIDFormat']); }
}

export default ClubPiggyTypesParser;
