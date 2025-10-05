class ChronosTextEntry {
    static Encode(stream: any, Str: string, Int: number) {
        stream.WriteString(Str);
        stream.WriteVInt(Int);
    }
}

export default ChronosTextEntry