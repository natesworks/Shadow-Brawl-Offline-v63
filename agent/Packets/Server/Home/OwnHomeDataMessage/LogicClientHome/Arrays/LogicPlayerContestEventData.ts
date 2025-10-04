import LogicGemOffer from "./LogicGemOffer";

class LogicPlayerContestEventData {
    static Encode(stream: any): void {
        stream.WriteVInt(0);
        stream.WriteVInt(0);

        stream.WriteLong(0, 1);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        
        stream.WriteLong(0, 1);

        stream.WriteBoolean(false);
        {
            LogicGemOffer.Encode(stream, 57, 14888, 0, 0, 0);
        }

        stream.WriteVInt(0);
    }
}

export default LogicPlayerContestEventData