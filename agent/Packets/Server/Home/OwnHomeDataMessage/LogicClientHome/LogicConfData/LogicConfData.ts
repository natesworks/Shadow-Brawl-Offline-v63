import ChronosAssetListEvent from "./Arrays/ChronosAssetListEvent";
import IntValueEntry from "./Arrays/IntValueEntry";
import EventData from "./Arrays/EventData";
import ReleaseEntry from "./Arrays/ReleaseEntry";
import TimedIntValueEntry from "./Arrays/TimedIntValueEntry";

class LogicConfData {
    static Encode(stream: any): void {
        stream.WriteVInt(2025074);

        stream.WriteVInt(52); // Event Slots
        for (let EventID = 0; EventID < 52; EventID++) {
            stream.WriteVInt(EventID);
        }
        
        stream.WriteVInt(EventData.EventCount); // EventData::encode
        {
            EventData.EncodeEvents(stream);
        }

        stream.WriteVInt(0); // EventData::encode
        stream.WriteVInt(0); // EventData::encode

        LogicConfData.EncodeIntList(stream, [0]);
        LogicConfData.EncodeIntList(stream, [0]);
        LogicConfData.EncodeIntList(stream, [0]);

        stream.WriteVInt(1); // ReleaseEntry::encode
        {
            ReleaseEntry.Encode(stream, 0, 0, 0, 0, 0, false);
        }
        
        IntValueEntry.Encode(stream);

        stream.WriteVInt(1); // TimedIntValueEntry::encode
        {
            TimedIntValueEntry.Encode(stream, 0, 0, 0, 0);
        }
        stream.WriteVInt(0); // CustomEvent::encode
        stream.WriteVInt(0); // ShopChainOfferThemeEntry::encode
        stream.WriteVInt(0); // AdPlacementEntry::encode
        stream.WriteVInt(0); // ThemeOverrideEntry::encode
        stream.WriteVInt(0); // JoinClubEventEntry::encode
        stream.WriteVInt(0); // DailyFortuneCookieEntry::encode
        stream.WriteVInt(1); // ChronosAssetListEvent::encode
        {
            ChronosAssetListEvent.Encode(stream);
        }
        stream.WriteVInt(0); // ShopVisualOfferGroupingEntry::encode
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        LogicConfData.EncodeIntList(stream, [0]);
        stream.WriteVInt(0); // NewsInboxLinkEntry::encode
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
    }

    static EncodeIntList(stream: any, IntList: number[]) {
        stream.WriteVInt(IntList[0]); // No Logic Yet
    }
}

export default LogicConfData