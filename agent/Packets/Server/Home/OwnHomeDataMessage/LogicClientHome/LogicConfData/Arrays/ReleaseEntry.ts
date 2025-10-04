class ReleaseEntry {
    static Encode(stream: any, CSVId: number, CSVRow: number, Time: number, SecondTime: number, ThirdTime: number, IsNew: boolean): void {
        stream.WriteDataReference(CSVId, CSVRow);
        stream.WriteInt(Time);
        stream.WriteInt(SecondTime);
        stream.WriteInt(ThirdTime);
        stream.WriteBoolean(IsNew);
    }
}

export default ReleaseEntry