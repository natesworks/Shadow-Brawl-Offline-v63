import ByteStream from "../../../../DataStream/ByteStream.js";
import LogicClientHome from "./LogicClientHome/LogicClientHome.js";
import LogicClientAvatar from "./LogicClientAvatar/LogicClientAvatar.js";
import player from "../../../../Configuration/LogicPlayerData.js";

class OwnHomeDataMessage {
    public static ClientHome: any
    public static ClientAvatar: any

    static Encode(): number[] {
        let stream = new ByteStream([]);

        stream.WriteVInt(1757882887);
        stream.WriteVInt(-1230828389);

        OwnHomeDataMessage.ClientHome = LogicClientHome.Encode(stream);
        OwnHomeDataMessage.ClientAvatar = new LogicClientAvatar(stream);
        
        return stream.Payload;
    }

    static GetMessageType(): number {
        return 24101;
    }
}

export default OwnHomeDataMessage;