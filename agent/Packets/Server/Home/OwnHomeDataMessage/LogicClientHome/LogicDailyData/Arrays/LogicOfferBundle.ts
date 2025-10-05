import LogicGemOffer from "../../Arrays/LogicGemOffer";

class LogicOfferBundle {
    static Encode(stream: any): void {
        stream.WriteVInt(1);

        stream.WriteVInt(1); // Rewards Count
        {
            LogicGemOffer.Encode(stream, 74, 1337, 0, 0, 0);
        }

        stream.WriteVInt(1); // Rewards Count
        {
            LogicGemOffer.Encode(stream, 74, 1337, 0, 0, 0);
        }

        stream.WriteVInt(1); // Currency -> 0 => gems & 1 => gold
        stream.WriteVInt(1337); // Price
        stream.WriteVInt(1337); // Offer Time
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteBoolean(false); // Daily Offer
        stream.WriteVInt(0);
        stream.WriteString("H*lloween Boxes!"); // Offer Text
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteString("offer_bgr_street"); // Offer Background
        stream.WriteVInt(0);
        stream.WriteBoolean(false); // This purchase is already being processed
        stream.WriteVInt(0); // Type Benefit
        stream.WriteVInt(0); // Benefit
        stream.WriteString("");
        stream.WriteBoolean(false); // One time offer
        stream.WriteBoolean(false); // Claimed
        stream.WriteDataReference(0, 0);
        stream.WriteDataReference(0, 0);
        stream.WriteDataReference(0, 0);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteDataReference(0, 0);
        stream.WriteVInt(0);
    }
}

export default LogicOfferBundle