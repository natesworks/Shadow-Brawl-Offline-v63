// thx gpt (used it bc i was lazy lol)
interface Brawler {
    CardID: number;
    Trophies: number;
    HighestTrophies: number;
    PowerLevel: number;
    MasteryPoints: number;
    MasteryClaimed: number;
    PowerPoints: number;
    State: number;
}

interface Currencys {
    FreeDiamonds: number;
    Diamonds: number;
    Gold: number;
    PowerPoints: number;
    CollabPoints: number;
    ChromaCredits: number;
    Blings: number;
}

interface MiscData {
    Trophies: number;
    HighestTrophies: number;
    TrophyRoadTier: number;
    ExperienceLevel: number;
    Thumbnail: number;
    NameColor: number;
    TokenDoubler: number;
    CreatorCode: string;
    Region: string;
}

interface Player {
    OwnedBrawlers: {
        [key: number]: Brawler;
    };
    Currencys: {
        [key: number]: Currencys;
    }
}

class LogicPlayerData {
    public static OwnedBrawlers: Record<number, Brawler> = {
        0: { CardID: 0, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        1: { CardID: 4, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        2: { CardID: 8, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        3: { CardID: 12, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        4: { CardID: 16, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        5: { CardID: 20, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        6: { CardID: 24, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        7: { CardID: 28, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        8: { CardID: 32, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        9: { CardID: 36, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        10: { CardID: 40, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        11: { CardID: 44, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        12: { CardID: 48, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        13: { CardID: 52, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        14: { CardID: 56, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        15: { CardID: 60, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        16: { CardID: 64, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        17: { CardID: 68, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        18: { CardID: 72, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        19: { CardID: 95, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        20: { CardID: 100, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        21: { CardID: 105, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        22: { CardID: 110, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        23: { CardID: 115, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        24: { CardID: 120, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        25: { CardID: 125, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        26: { CardID: 130, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        27: { CardID: 177, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        28: { CardID: 182, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        29: { CardID: 188, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        30: { CardID: 194, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        31: { CardID: 200, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        32: { CardID: 206, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        34: { CardID: 218, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        35: { CardID: 224, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        36: { CardID: 230, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        37: { CardID: 236, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        38: { CardID: 279, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        39: { CardID: 296, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        40: { CardID: 303, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        41: { CardID: 320, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        42: { CardID: 327, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        43: { CardID: 334, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        44: { CardID: 341, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        45: { CardID: 358, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        46: { CardID: 365, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        47: { CardID: 372, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        48: { CardID: 379, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        49: { CardID: 386, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        50: { CardID: 393, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        51: { CardID: 410, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        52: { CardID: 417, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        53: { CardID: 427, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        54: { CardID: 434, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        56: { CardID: 448, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        57: { CardID: 466, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        58: { CardID: 474, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        59: { CardID: 491, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        60: { CardID: 499, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        61: { CardID: 507, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        62: { CardID: 515, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        63: { CardID: 523, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        64: { CardID: 531, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        65: { CardID: 539, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        66: { CardID: 547, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        67: { CardID: 557, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        68: { CardID: 565, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        69: { CardID: 573, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        70: { CardID: 581, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        71: { CardID: 589, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        72: { CardID: 597, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        73: { CardID: 605, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        74: { CardID: 619, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        75: { CardID: 633, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        76: { CardID: 642, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        77: { CardID: 655, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        78: { CardID: 663, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        79: { CardID: 671, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        80: { CardID: 730, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        81: { CardID: 748, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        82: { CardID: 760, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        83: { CardID: 768, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        84: { CardID: 800, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        85: { CardID: 811, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        86: { CardID: 828, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        87: { CardID: 844, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        88: { CardID: 862, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        89: { CardID: 871, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        90: { CardID: 879, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        91: { CardID: 901, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        92: { CardID: 911, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        93: { CardID: 925, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        94: { CardID: 934, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        95: { CardID: 985, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        96: { CardID: 994, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        97: { CardID: 1035, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
        98: { CardID: 1043, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    }

    public static Currencys: {}
    public static MiscData: MiscData = {
        Trophies: 100000,
        HighestTrophies: 100000,
        TrophyRoadTier: 999,
        ExperienceLevel: 999,
        Thumbnail : 0,
        NameColor: 6,
        TokenDoubler: 100000,
        CreatorCode: "@soufgamev2",
        Region: "EN",
    }
};

export default LogicPlayerData