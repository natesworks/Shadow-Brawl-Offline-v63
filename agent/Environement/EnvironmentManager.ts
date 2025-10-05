import Environment from "./Environment";
import Debugger from "../Utils/Debugger";
import Addresses from "../Manager/Addresses";
import Functions from "../Manager/Functions";

class EnvironmentManager {
    static InitEnvironment() { // hmm before this was fetching script from server and addng prots but tbh adding prots is useless gatekeepijg is bad
        Addresses.Init();
        Functions.Init()
    }
}

export default EnvironmentManager