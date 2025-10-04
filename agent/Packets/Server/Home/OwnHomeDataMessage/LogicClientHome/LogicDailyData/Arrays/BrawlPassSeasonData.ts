class BrawlPassSeasonData {
    static Encode(stream: any): void {
        stream.WriteVInt(1); // Seasons Count
        {
            stream.WriteVInt(43 - 1) // Current Season
            stream.WriteVInt(10000) // BP Tokens
            stream.WriteBoolean(true) // Brawl Pass State
            stream.WriteVInt(0)
            stream.WriteBoolean(false)

            stream.WriteBoolean(true)
            stream.WriteInt(0)
            stream.WriteInt(0)
            stream.WriteInt(0)
            stream.WriteInt(0)

            stream.WriteBoolean(true)
            stream.WriteInt(0)
            stream.WriteInt(0)
            stream.WriteInt(0)
            stream.WriteInt(0)

            stream.WriteBoolean(true) // Brawl Pass Plus State
            stream.WriteBoolean(true)
            stream.WriteInt(0)
            stream.WriteInt(0)
            stream.WriteInt(0)
            stream.WriteInt(0)
        }
    }
}

export default BrawlPassSeasonData