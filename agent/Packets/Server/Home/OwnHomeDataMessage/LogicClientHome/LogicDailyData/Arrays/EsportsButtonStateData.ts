class EsportsButtonStateData {
    static Encode(stream: any): void {
        stream.WriteVInt(22);
        stream.WriteVInt(22);
        stream.WriteVInt(22);
    }
}

export default EsportsButtonStateData