class ChallengeRewardNotification {
    static Encode(stream: any) {
        stream.WriteVInt(0); // LogicRewards::encode
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        
        stream.WriteString("");
        stream.WriteBoolean(false);
    }
}

export default ChallengeRewardNotification