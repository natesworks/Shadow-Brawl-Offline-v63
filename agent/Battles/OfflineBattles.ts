import Debugger from "../Utils/Debugger";
import LogicAccessory from "./LogicAccessory";
import LogicCharacterServer from "./LogicCharacterServer";
import LogicGear from "./LogicGear";

class OfflineBattles {
    static Init() {
        Debugger.Debug("[+][OfflineBattles::InitBattles] Initialising Battles!");
        LogicCharacterServer.Init();
        LogicAccessory.Init();
        LogicGear.Init();
        Debugger.Debug("[+][OfflineBattles::InitBattles] Initialized Battles!");
    }
}

export default OfflineBattles