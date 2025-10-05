import Addresses from "../../Manager/Addresses.js";
import Environment from "../../Environement/Environment.js";
import BitStream from "../../DataStream/BitStream.js";
import LogicBattleModeServer from "../../Packets/Server/Battles/LogicBattleModeServer.js";
import Functions from "../../Manager/Functions.js";
import PiranhaMessage from "../PiranhaMessage/PiranhaMessage.js";
import Debugger from "../../Utils/Debugger.js";
import VisionUpdateMessage from "../../Packets/Server/Battles/VisionUpdateMessage.js";

// Credit to nates for sendoff mess
class Messaging {
    static SendOfflineMessage(Id: number, Payload: number[]): NativePointer {
        let Version = Id === 20104 ? 1 : 0;
        if (Id != 24109) {
            Debugger.Info(`Sending offline message with Packet ID ${Id}, Payload size ${Payload.length}, Version ${Version}`);
        }

        let Factory = Functions.Imports.Malloc(1024);
        Factory.writePointer(Addresses.LogicLaserMessageFactory);

        let Message = Functions.LogicLaserMessageFactory.CreateMessageByType(Factory, Id);
        Message.add(136).writeS64(Version);

        let PayloadLengthPtr = PiranhaMessage.GetByteStream(Message).add(24);
        Memory.protect(PayloadLengthPtr, 4, 'rw-');
        PayloadLengthPtr.writeS64(Payload.length);

        if (Payload.length > 0) {
            let PayloadPtr = Functions.Imports.Malloc(Payload.length).writeByteArray(Payload);
            PiranhaMessage.GetByteStream(Message).add(56).writePointer(PayloadPtr);
        }

        let DecodeFnPtr = Message.readPointer().add(24).readPointer();

        let Decode = new NativeFunction(DecodeFnPtr, "void", ["pointer"]);
        Decode(Message);

        Functions.Messaging.ReceiveMessage(Addresses.MessageManagerInstance.readPointer(), Message);

        return Message;
    }
}

export default Messaging;