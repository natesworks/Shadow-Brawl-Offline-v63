
class LogicAccessory {
    static Encode(Stream: any) {
        let Boolean = Stream.WriteBoolean(true); // Owns Accessory

        if (Boolean) {
            let PositiveVIntMax65535 = Stream.readPositiveVIntMax65535();
        }
        else {
            let PositiveVIntMax65535 = 0;
        }

        let v11 = Stream.readPositiveVIntMax65535();
        let PositiveVIntMax255OftenZero = Stream.readPositiveVIntMax255OftenZero();

        
    }
}

export default LogicAccessory