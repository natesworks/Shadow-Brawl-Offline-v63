import LogicGameModeUtil from "./Utils/LogicGameModeUtil"

class LogicBattleModeServer {
    static Ticks: number = 1
    static HandledInputs: number = 0
    static Spectators: number = 0
    static IsBrawlTV: boolean = false

    static PlayerCount: number = 1 // LogicGameModeUtil.GetPlayerCount();
    static PlayerIndex: number = 0
    static TeamIndex: number = 0

    static ModifiersCount: number = 0
    static ModifiersID: number[] = [0]

    static CurrentPlayersInMM: number = 0
    static MaxPlayers: number = 6
    static MMTimer: number = 3
}

export default LogicBattleModeServer