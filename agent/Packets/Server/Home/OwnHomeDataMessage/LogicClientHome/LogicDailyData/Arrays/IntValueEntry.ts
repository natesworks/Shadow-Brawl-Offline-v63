class IntValueEntry {
    static Encode(stream: any): void {
        stream.WriteVInt(18);
        stream.WriteDataReference(2, 1); // Unknown
        stream.WriteDataReference(6, 0); // Demo Account
        stream.WriteDataReference(7, 0); // Is Invite Block On
        stream.WriteDataReference(9, 1); // Show Star Points
        stream.WriteDataReference(10, 0); // Power Play Trophies Gained
        stream.WriteDataReference(12, 1); // Unknown
        stream.WriteDataReference(14, 0); // Coins Gained
        stream.WriteDataReference(15, 1); // Age Popup
        stream.WriteDataReference(16, 1);
        stream.WriteDataReference(17, 0); // Team Chat Muted
        stream.WriteDataReference(18, 1); // Esport Button
        stream.WriteDataReference(19, 0); // Champion Ship Lives Buy Popup
        stream.WriteDataReference(21, 1); // Looking For Team State
        stream.WriteDataReference(22, 1);
        stream.WriteDataReference(23, 0); // Club Trophies Gained
        stream.WriteDataReference(24, 1); // Have already watched club league stupid animation
        stream.WriteDataReference(41, 100); // Ranked Reputation
        stream.WriteDataReference(52, 1); // Trophy Box Feature Unlocked
    }
}

export default IntValueEntry