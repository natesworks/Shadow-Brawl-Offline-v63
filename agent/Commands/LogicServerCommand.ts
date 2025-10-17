import LogicCommand from "../Protocol/Messaging/LogicCommand";

class LogicServerCommand {
    static Encode(stream: any) {
        stream.WriteVInt(0);
        LogicCommand.Encode(stream);
    }
}

export default LogicServerCommand;