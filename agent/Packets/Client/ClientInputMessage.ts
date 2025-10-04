import ByteStream from "../../DataStream/ByteStream";

class ClientInputMessage {
    static Decode(): any {
        let Stream = new ByteStream([]);

        return Stream.Payload;
    }

    static GetMessageType(): number {
        return 10555;
    }
}

export default ClientInputMessage;
