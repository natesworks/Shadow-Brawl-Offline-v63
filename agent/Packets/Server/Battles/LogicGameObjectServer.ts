import LogicBattleModeServer from "./LogicBattleModeServer";

class LogicGameObjectServer {
    static Encode(Stream: any) {
        Stream.WritePositiveVIntMax65535(2550); // Position X
        Stream.WritePositiveVIntMax65535(8550); // Position Y
        Stream.WritePositiveVIntMax65535(0); // RenderZ Z
        Stream.WritePositiveVIntMax255(17 * LogicBattleModeServer.PlayerCount); // Object ID
        Stream.WritePositiveIntMax3(0);
       
        LogicTraitController.Encode(Stream);
    }
}

class LogicTraitController {
    static Encode(Stream: any) {
        Stream.WriteBoolean(false);
    }
}

export default LogicGameObjectServer;
