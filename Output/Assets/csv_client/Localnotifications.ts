class Localnotifications {
    static Ccstart = class {
        static Name = "CCStart"
        static Priority = 10000
        static Notificationtext = "TID_NOTIFICATION_CC_STARTED"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 60
        static Checkrangemins = 0
        static RowID = 1
    }
    static Ccreminder = class {
        static Name = "CCReminder"
        static Priority = 10000
        static Notificationtext = "TID_NOTIFICATION_CC_ENDING"
        static Timeoffsetmins = -600
        static Maxrandomtimeoffsetmins = 60
        static Checkrangemins = 0
        static RowID = 2
    }
    static Psgstart = class {
        static Name = "PSGStart"
        static Priority = 10000
        static Notificationtext = "TID_NOTIFICATION_PSG_STARTED"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 60
        static Checkrangemins = 0
        static RowID = 3
    }
    static Psgreminder = class {
        static Name = "PSGReminder"
        static Priority = 10000
        static Notificationtext = "TID_NOTIFICATION_PSG_ENDING"
        static Timeoffsetmins = -600
        static Maxrandomtimeoffsetmins = 60
        static Checkrangemins = 0
        static RowID = 4
    }
    static Coinrushstart = class {
        static Name = "CoinRushStart"
        static Priority = 2
        static Notificationtext = "TID_NOTIFICATION_COIN_RUSH"
        static Isregulareventrefresh = true
        static Timeoffsetmins = 30
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 5
    }
    static Attackdefendstart = class {
        static Name = "AttackDefendStart"
        static Priority = 5
        static Notificationtext = "TID_NOTIFICATION_ATTACK_DEFEND"
        static Isregulareventrefresh = true
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 6
    }
    static Bountystart = class {
        static Name = "BountyStart"
        static Priority = 5
        static Notificationtext = "TID_NOTIFICATION_BOUNTY_HUNTER"
        static Isregulareventrefresh = true
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 7
    }
    static Laserballstart = class {
        static Name = "LaserBallStart"
        static Priority = 2
        static Notificationtext = "TID_NOTIFICATION_LASER_BALL"
        static Isregulareventrefresh = true
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 8
    }
    static Brstart = class {
        static Name = "BRStart"
        static Priority = 2
        static Notificationtext = "TID_NOTIFICATION_BATTLE_ROYAL"
        static Isregulareventrefresh = true
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 9
    }
    static Bossstart = class {
        static Name = "BossStart"
        static Priority = 1000
        static Notificationtext = "TID_NOTIFICATION_BOSS"
        static Timeoffsetmins = 60
        static Maxrandomtimeoffsetmins = 60
        static Checkrangemins = 0
        static RowID = 10
    }
    static Coopstart = class {
        static Name = "CoopStart"
        static Priority = 1000
        static Notificationtext = "TID_NOTIFICATION_COOP"
        static Timeoffsetmins = 60
        static Maxrandomtimeoffsetmins = 60
        static Checkrangemins = 0
        static RowID = 11
    }
    static Raidbossstart = class {
        static Name = "RaidBossStart"
        static Priority = 1000
        static Notificationtext = "TID_NOTIFICATION_RAID_BOSS"
        static Timeoffsetmins = 60
        static Maxrandomtimeoffsetmins = 60
        static Checkrangemins = 0
        static RowID = 12
    }
    static Robowarsstart = class {
        static Name = "RoboWarsStart"
        static Priority = 1000
        static Notificationtext = "TID_NOTIFICATION_ROBO_WARS"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 13
    }
    static Takedownstart = class {
        static Name = "TakedownStart"
        static Priority = 3
        static Notificationtext = "TID_NOTIFICATION_BOSS_RACE"
        static Isregulareventrefresh = true
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 14
    }
    static Lonestarstart = class {
        static Name = "LoneStarStart"
        static Priority = 3
        static Notificationtext = "TID_NOTIFICATION_LONE_STAR"
        static Isregulareventrefresh = true
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 15
    }
    static Ctfstart = class {
        static Name = "CTFStart"
        static Priority = 3
        static Notificationtext = "TID_NOTIFICATION_CTF"
        static Isregulareventrefresh = true
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 16
    }
    static Kohstart = class {
        static Name = "KOHStart"
        static Priority = 5
        static Notificationtext = "TID_NOTIFICATION_KING_OF_HILL"
        static Isregulareventrefresh = true
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 17
    }
    static Multiplemodesstart = class {
        static Name = "MultipleModesStart"
        static Priority = 10
        static Notificationtext = "TID_NOTIFICATION_MULTIPLE_MODES"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 18
    }
    static Freebox = class {
        static Name = "FreeBox"
        static Priority = 1
        static Notificationtext = "TID_FREE_BOX_AVAILABLE_0"
        static Timeoffsetmins = 60
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 120
        static RowID = 19
    }
    static Row20 = class {
        static Notificationtext = "TID_FREE_BOX_AVAILABLE_1"
        static RowID = 20
    }
    static Row21 = class {
        static Notificationtext = "TID_FREE_BOX_AVAILABLE_2"
        static RowID = 21
    }
    static Row22 = class {
        static Notificationtext = "TID_FREE_BOX_AVAILABLE_3"
        static RowID = 22
    }
    static Row23 = class {
        static Notificationtext = "TID_FREE_BOX_AVAILABLE_4"
        static RowID = 23
    }
    static Seasonend = class {
        static Name = "SeasonEnd"
        static Priority = 2000
        static Notificationtext = "TID_SEASON_ENDED_NOTI"
        static Timeoffsetmins = 30
        static Maxrandomtimeoffsetmins = 60
        static RowID = 24
    }
    static Keybarfull = class {
        static Name = "KeyBarFull"
        static Priority = 100000
        static Notificationtext = "TID_KEY_BAR_FULL"
        static Dontcompare = true
        static RowID = 25
    }
    static Comebacksmall = class {
        static Name = "ComeBackSmall"
        static Priority = 1
        static Notificationtext = "TID_COME_BACK_NOTIFICATION_SMALL"
        static Autoadd = true
        static Timeoffsetmins = 2880
        static Checkrangemins = 1440
        static RowID = 26
    }
    static Comebackmedium = class {
        static Name = "ComeBackMedium"
        static Priority = 1
        static Notificationtext = "TID_COME_BACK_NOTIFICATION_MEDIUM"
        static Autoadd = true
        static Timeoffsetmins = 7200
        static Checkrangemins = 1440
        static RowID = 27
    }
    static Comebacklarge = class {
        static Name = "ComeBackLarge"
        static Priority = 1
        static Notificationtext = "TID_COME_BACK_NOTIFICATION_LARGE"
        static Autoadd = true
        static Timeoffsetmins = 14400
        static Checkrangemins = 1440
        static RowID = 28
    }
    static Pprefresh = class {
        static Name = "PPRefresh"
        static Priority = 500
        static Notificationtext = "TID_POWER_PLAY_NOTIFICATION"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 29
    }
    static Newbrawler = class {
        static Name = "NewBrawler"
        static Priority = 50000
        static Notificationtext = "TID_NOTIFICATION_NEW_BRAWLER"
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 30
    }
    static Doubletokens = class {
        static Name = "DoubleTokens"
        static Priority = 1500
        static Notificationtext = "TID_NOTIFICATION_DOUBLE_TOKENS_STARTED"
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 31
    }
    static Doublecoins = class {
        static Name = "DoubleCoins"
        static Priority = 1500
        static Notificationtext = "TID_NOTIFICATION_DOUBLE_COINS_STARTED"
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 32
    }
    static Bpseasonstart = class {
        static Name = "BPSeasonStart"
        static Priority = 50000
        static Notificationtext = "TID_NOTIFICATION_BP_SEASON_STARTED"
        static Maxrandomtimeoffsetmins = 30
        static RowID = 33
    }
    static Bpseasonreminder = class {
        static Name = "BPSeasonReminder"
        static Priority = 50000
        static Notificationtext = "TID_NOTIFICATION_BP_SEASON_ENDING"
        static Timeoffsetmins = -7200
        static Maxrandomtimeoffsetmins = 30
        static RowID = 34
    }
    static Questbatch = class {
        static Name = "QuestBatch"
        static Priority = 750
        static Notificationtext = "TID_NOTIFICATION_QUEST_REFRESH"
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 60
        static RowID = 35
    }
    static Towncrusherstart = class {
        static Name = "TownCrusherStart"
        static Priority = 1000
        static Notificationtext = "TID_NOTIFICATION_TOWN_CRUSHER"
        static Timeoffsetmins = 60
        static Maxrandomtimeoffsetmins = 60
        static Checkrangemins = 0
        static RowID = 36
    }
    static Genericchallengestart = class {
        static Name = "GenericChallengeStart"
        static Priority = 10000
        static Notificationtext = "TID_NOTIFICATION_CHALLENGE_STARTED"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 60
        static Checkrangemins = 0
        static RowID = 37
    }
    static Genericchallengereminder = class {
        static Name = "GenericChallengeReminder"
        static Priority = 10000
        static Notificationtext = "TID_NOTIFICATION_CHALLENGE_ENDING"
        static Timeoffsetmins = -600
        static Maxrandomtimeoffsetmins = 60
        static Checkrangemins = 0
        static RowID = 38
    }
    static Rankedseasonstart = class {
        static Name = "RankedSeasonStart"
        static Priority = 50000
        static Notificationtext = "TID_NOTIFICATION_RANKED_SEASON_STARTED"
        static Maxrandomtimeoffsetmins = 30
        static RowID = 39
    }
    static Rankedseasonreminder = class {
        static Name = "RankedSeasonReminder"
        static Priority = 50000
        static Notificationtext = "TID_NOTIFICATION_RANKED_SEASON_ENDING"
        static Timeoffsetmins = -4320
        static Maxrandomtimeoffsetmins = 30
        static RowID = 40
    }
    static Knockoutstart = class {
        static Name = "KnockoutStart"
        static Priority = 5
        static Notificationtext = "TID_NOTIFICATION_KNOCKOUT"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 41
    }
    static Tagteamstart = class {
        static Name = "TagTeamStart"
        static Priority = 5
        static Notificationtext = "TID_NOTIFICATION_TAG_TEAM"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 42
    }
    static Cldaystart = class {
        static Name = "CLDayStart"
        static Priority = 10000
        static Notificationtext = "TID_NOTIFICATION_CLUB_LEAGUE_EVENT_DAY_STARTED"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 60
        static Checkrangemins = 0
        static RowID = 43
    }
    static Deathmatchstart = class {
        static Name = "DeathmatchStart"
        static Priority = 5
        static Notificationtext = "TID_NOTIFICATION_DEATHMATCH"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 44
    }
    static Payloadstart = class {
        static Name = "PayloadStart"
        static Priority = 5
        static Notificationtext = "TID_NOTIFICATION_PAYLOAD"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 45
    }
    static Invasionstart = class {
        static Name = "InvasionStart"
        static Priority = 5
        static Notificationtext = "TID_NOTIFICATION_INVASION"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 46
    }
    static Randomstart = class {
        static Name = "RandomStart"
        static Priority = 5
        static Notificationtext = "TID_NOTIFICATION_RANDOM"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 47
    }
    static Deathmatchffastart = class {
        static Name = "DeathmatchFFAStart"
        static Priority = 5
        static Notificationtext = "TID_NOTIFICATION_DEATHMATCH_FFA"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 48
    }
    static Comebackreengage = class {
        static Name = "ComeBackReengage"
        static Priority = 1
        static Notificationtext = "TID_COME_BACK_NOTIFICATION_EXTRA_LARGE"
        static Autoadd = true
        static Timeoffsetmins = 87840
        static Checkrangemins = 1440
        static RowID = 49
    }
    static Arenastart = class {
        static Name = "ArenaStart"
        static Priority = 5
        static Notificationtext = "TID_NOTIFICATION_ARENA"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 50
    }
    static Dailystreak = class {
        static Name = "DailyStreak"
        static Priority = 45000
        static Notificationtext = "TID_NOTIFICATION_DAILY_STREAK"
        static Dontcompare = true
        static Timeoffsetmins = 1
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 51
    }
    static Multiplemodesstartnew = class {
        static Name = "MultipleModesStartNew"
        static Priority = 49000
        static Notificationtext = "TID_NOTIFICATION_NEW_GAME_MODES"
        static Timeoffsetmins = 15
        static Maxrandomtimeoffsetmins = 30
        static Checkrangemins = 0
        static RowID = 52
    }
}

export default Localnotifications;