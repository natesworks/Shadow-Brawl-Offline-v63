class LogicDataSeenStates {
    static Encode(stream: any): void {
        stream.WriteVInt(0);
    }
}

export default LogicDataSeenStates