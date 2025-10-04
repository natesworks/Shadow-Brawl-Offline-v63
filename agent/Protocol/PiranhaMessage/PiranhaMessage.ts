class PiranhaMessage {
    static Encode(Message: NativePointer): number { 
        return (new NativeFunction(Message.readPointer().add(16).readPointer(), "int", ["pointer"]))(Message); 
    }

    static Decode(Message: NativePointer): number { 
        return (new NativeFunction(Message.readPointer().add(24).readPointer(), "int", ["pointer"]))(Message); 
    }

    static GetServiceNodeType(Message: NativePointer): number { 
        return (new NativeFunction(Message.readPointer().add(32).readPointer(), "int", ["pointer"]))(Message); 
    }

    static GetMessageType(Message: NativePointer): number { 
        return (new NativeFunction(Message.readPointer().add(40).readPointer(), "int", ["pointer"]))(Message); 
    }

    static GetMessageTypeName(Message: NativePointer): NativePointer { 
        return (new NativeFunction(Message.readPointer().add(48).readPointer(), "pointer", ["pointer"]))(Message); 
    }

    static Destruct(Message: NativePointer): number { 
        return (new NativeFunction(Message.readPointer().add(56).readPointer(), "int", ["pointer"]))(Message); 
    }

    static GetByteStream(Message: NativePointer): NativePointer { 
        return Message.add(8);
    }

}

export default PiranhaMessage;
