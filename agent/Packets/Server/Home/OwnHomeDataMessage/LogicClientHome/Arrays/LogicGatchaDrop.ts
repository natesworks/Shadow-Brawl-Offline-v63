class LogicGatchaDrop {
    static Encode(stream: any): void {
        stream.WriteVInt(0);
        stream.WriteDataReference(0);
        stream.WriteVInt(0);

        stream.WriteDataReference(0);
        stream.WriteDataReference(0);
        stream.WriteDataReference(0);

        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
    }
}

export default LogicGatchaDrop