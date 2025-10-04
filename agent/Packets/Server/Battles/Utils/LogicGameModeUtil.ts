import Functions from "../../../../Manager/Functions";
import Addresses from "../../../../Manager/Addresses";

class LogicGameModeUtil {
    static GetPlayerCount() {
        let PlayerCount = Functions.LogicGameModeUtil.GetPlayerCount(Addresses.sm_offlineLocation);
        return PlayerCount;
    }
}

export default LogicGameModeUtil