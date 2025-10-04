import Environment from "./Environment";
import Debugger from "../Utils/Debugger";
import Addresses from "../Manager/Addresses";
import Functions from "../Manager/Functions";

class EnvironmentManager {
    static InitEnvironment() {
        Addresses.Init();
        Functions.Init()
    }
}

export default EnvironmentManager