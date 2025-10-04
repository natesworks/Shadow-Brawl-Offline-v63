import LogicGemOffer from "./LogicGemOffer";

class LogicLoginCalendar {
    static Encode(stream: any): void {
        LogicLoginCalendarTrack.Encode(stream);

        stream.WriteVInt(3); // LogicLoginCalendarTrack::encode
        {
            LogicLoginCalendarTrack.Encode(stream);
            LogicLoginCalendarTrack.Encode(stream);
            LogicLoginCalendarTrack.Encode(stream);
        }
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);

        stream.WriteBoolean(false);
        stream.WriteBoolean(false);

        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
    }
}

class LogicLoginCalendarTrack {
    static Encode(stream: any): void {
        stream.WriteVInt(1);
        stream.WriteVInt(1);
        {
            LogicLoginCalendarDay.Encode(stream);
        }
    }
}

class LogicLoginCalendarDay {
    static Encode(stream: any): void {
        stream.WriteVInt(1);
        stream.WriteBoolean(true);
        stream.WriteVInt(1);
        {
            LogicLoginCalendarRewardOption.Encode(stream);
        }
    }
}

class LogicLoginCalendarRewardOption {
    static Encode(stream: any): void {
        LogicGemOffer.Encode(stream, 3, 1, 16, 76, 0);
        stream.WriteBoolean(false);
    }
}
export default LogicLoginCalendar