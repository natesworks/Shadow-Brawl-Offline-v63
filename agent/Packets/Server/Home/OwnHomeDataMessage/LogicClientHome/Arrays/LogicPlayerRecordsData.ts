class LogicPlayerRecordsData {
    static Encode(stream: any): void {
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0);
        stream.WriteVInt(0); // Records Points
        stream.WriteVInt(0); // Array
        {
            // stream.WriteVInt(13); // Records Rank
        }
        
        LogicPlayerRecordsData.EncodeCustom(stream);
    }
    static EncodeCustom(stream: any): void {
        stream.WriteVInt(0);
    } 
}

export default LogicPlayerRecordsData