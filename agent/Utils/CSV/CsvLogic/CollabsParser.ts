class CollabsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        CollabsParser.Data = csvData;
    }
    static GetName() { return CollabsParser.Data.map(row => row['Name']); }
    static GetTid() { return CollabsParser.Data.map(row => row['TID']); }
    static GetCollabid() { return CollabsParser.Data.map(row => row['CollabId']); }
    static GetEventpanelexportname() { return CollabsParser.Data.map(row => row['EventPanelExportName']); }
    static GetSpecialeventpanelexportname() { return CollabsParser.Data.map(row => row['SpecialEventPanelExportName']); }
    static GetEventpanelmirrorexportname() { return CollabsParser.Data.map(row => row['EventPanelMirrorExportName']); }
    static GetEventpanelfutureexportname() { return CollabsParser.Data.map(row => row['EventPanelFutureExportName']); }
    static GetSkillrewardslotcount() { return CollabsParser.Data.map(row => row['SkillRewardSlotCount']); }
    static GetGemoffertypeforwinslot() { return CollabsParser.Data.map(row => row['GemOfferTypeForWinSlot']); }
    static GetGemofferextraforwinslot() { return CollabsParser.Data.map(row => row['GemOfferExtraForWinSlot']); }
    static GetGemoffertypeforlossslot() { return CollabsParser.Data.map(row => row['GemOfferTypeForLossSlot']); }
    static GetGemofferextraforlossslot() { return CollabsParser.Data.map(row => row['GemOfferExtraForLossSlot']); }
    static GetUicharacter() { return CollabsParser.Data.map(row => row['UICharacter']); }
    static GetSkinscandropwithoutbrawler() { return CollabsParser.Data.map(row => row['SkinsCanDropWithoutBrawler']); }
    static GetSkinsinreward() { return CollabsParser.Data.map(row => row['SkinsInReward']); }
    static GetTicketsinskindraw() { return CollabsParser.Data.map(row => row['TicketsInSkinDraw']); }
    static GetTicketsinskinaltdraw() { return CollabsParser.Data.map(row => row['TicketsInSkinAltDraw']); }
    static GetSpecialskinsinreward() { return CollabsParser.Data.map(row => row['SpecialSkinsInReward']); }
    static GetTicketsinspecialskindraw() { return CollabsParser.Data.map(row => row['TicketsInSpecialSkinDraw']); }
    static GetSpraysinreward() { return CollabsParser.Data.map(row => row['SpraysInReward']); }
    static GetTicketsinspraydraw() { return CollabsParser.Data.map(row => row['TicketsInSprayDraw']); }
    static GetTicketsinsprayaltdraw() { return CollabsParser.Data.map(row => row['TicketsInSprayAltDraw']); }
    static GetProfilepicsinreward() { return CollabsParser.Data.map(row => row['ProfilePicsInReward']); }
    static GetTicketsinprofilepicdraw() { return CollabsParser.Data.map(row => row['TicketsInProfilePicDraw']); }
    static GetTicketsinprofilepicaltdraw() { return CollabsParser.Data.map(row => row['TicketsInProfilePicAltDraw']); }
    static GetPinsinreward() { return CollabsParser.Data.map(row => row['PinsInReward']); }
    static GetTicketsinpindraw() { return CollabsParser.Data.map(row => row['TicketsInPinDraw']); }
    static GetTicketsinpinaltdraw() { return CollabsParser.Data.map(row => row['TicketsInPinAltDraw']); }
    static GetClubcollabskin() { return CollabsParser.Data.map(row => row['ClubCollabSkin']); }
    static GetHideskinrewardsinclubtrack() { return CollabsParser.Data.map(row => row['HideSkinRewardsInClubTrack']); }
    static GetModifier() { return CollabsParser.Data.map(row => row['Modifier']); }
    static GetCollabmenuvfx() { return CollabsParser.Data.map(row => row['CollabMenuVFX']); }
    static GetCollabvfx() { return CollabsParser.Data.map(row => row['CollabVFX']); }
    static GetMutationscw() { return CollabsParser.Data.map(row => row['MutationSCW']); }
    static GetLeaderboardtabtid() { return CollabsParser.Data.map(row => row['LeaderboardTabTID']); }
    static GetLeaderboardtitletid() { return CollabsParser.Data.map(row => row['LeaderboardTitleTID']); }
    static GetLeaderboardscoretid() { return CollabsParser.Data.map(row => row['LeaderboardScoreTID']); }
    static GetThemeangelic() { return CollabsParser.Data.map(row => row['ThemeAngelic']); }
    static GetThemedemonic() { return CollabsParser.Data.map(row => row['ThemeDemonic']); }
    static GetHascollabshop() { return CollabsParser.Data.map(row => row['HasCollabShop']); }
    static GetHasshopkeeper() { return CollabsParser.Data.map(row => row['HasShopKeeper']); }
    static GetBrawlersforcollabshop() { return CollabsParser.Data.map(row => row['BrawlersForCollabShop']); }
    static GetTicketsinbrawlersforcollabshopdraw() { return CollabsParser.Data.map(row => row['TicketsInBrawlersForCollabShopDraw']); }
    static GetShopstylesnames() { return CollabsParser.Data.map(row => row['ShopStylesNames']); }
    static GetCoversids() { return CollabsParser.Data.map(row => row['CoversIds']); }
    static GetDiscounts() { return CollabsParser.Data.map(row => row['Discounts']); }
    static GetBundletitlebasedondiscount() { return CollabsParser.Data.map(row => row['BundleTitleBasedOnDiscount']); }
    static GetFramelabelbasedondiscount() { return CollabsParser.Data.map(row => row['FrameLabelBasedOnDiscount']); }
    static GetRemoveallexceptoneclipwithprefix() { return CollabsParser.Data.map(row => row['RemoveAllExceptOneClipWithPrefix']); }
    static GetChapternewsinboxlinkids() { return CollabsParser.Data.map(row => row['ChapterNewsInboxLinkIds']); }
}

export default CollabsParser;
