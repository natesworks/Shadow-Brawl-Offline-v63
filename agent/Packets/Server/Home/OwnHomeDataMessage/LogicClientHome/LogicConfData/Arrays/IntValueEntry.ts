class IntValueEntry {
    static ThemesID: number[] = [143, 144, 145, 146, 147, 148, 149, 150, 151];
    /* IntValueEntry Values: 
        getTrophySeasonResetTrophyLimit = 10063LL
        getChallengeLivesPurchasesRemaining = 10039LL
        getPremiumPassMissingBonusProgressFromWins = 10066LL
        getPremiumPassExtraProgress = 10069LL
        getPointsPerWinForPoors = 10065LL
        getPointsPerWinForRichs = 10066LL
        getPassPointsFromWinsLimitForPoors = 10067LL
        getPassPointsFromWinsLimitForRichs = 10068LL
        getProgressTowardsNextTailReward = 152LL
        getMadePlayerDraftMapsCount = 10029LL
        isPlayerEligibleToCreateMap = 10027LL
        LogicRandomRewardManager::isUnlocked = 10057LL
        LogicRandomRewardManager::isEnabled = 10056LL
        getHeroReleaseState = 68LL
        getTrophiesToUnlockTrophyLimitedEventSlot = 10036LL, 10037LL, 10049LL
        isEventSlotLocked = 10018LL, 10043LL
        LogicPurchaseFameCommand::execute = 10055LL
        LogicPurchaseChallengeLivesCommand = 10039LL
        getExtraProgress = 148LL
        TID_COMPETITIVE_PASS_TAIL_INFO_NEW = 152LL
        getKeepDailyStreakCostInGems = 163LL
    */

    static Encode(stream: any): void {
        stream.WriteVInt(8);
        stream.WriteDataReference(41000000 + IntValueEntry.ThemesID[Math.floor(Math.random() * IntValueEntry.ThemesID.length)], 1); 
        stream.WriteDataReference(89, 6);
        stream.WriteDataReference(22, 0);
        stream.WriteDataReference(36, 1);
        stream.WriteDataReference(73, 1);
        stream.WriteDataReference(16, 5);
        stream.WriteDataReference(10056, 1);
        stream.WriteDataReference(10057, 1);
    }
}

export default IntValueEntry