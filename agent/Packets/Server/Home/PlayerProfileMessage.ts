import ByteStream from "../../../DataStream/ByteStream";

class PlayerProfileMessage {
    static Encode(): number[] {
        let Stream = new ByteStream([]);

        Stream.WriteVLong(0, 256617006);
        Stream.WriteDataReference(16, 0);
        Stream.WriteDataReference(0);

        Stream.WriteVInt(1);
        {
            Stream.WriteDataReference(16, 1);
            Stream.WriteDataReference(0);
            Stream.WriteVInt(1250);
            Stream.WriteVInt(1250);
            Stream.WriteVInt(11);
            Stream.WriteVInt(0);
            Stream.WriteVInt(0);
        }

        Stream.WriteVInt(27);
        {
            Stream.WriteDataReference(1, 99) // 3v3 Wins
            Stream.WriteDataReference(3, 97) // Trophies
            Stream.WriteDataReference(4, 96) // Highest Trophies
            Stream.WriteDataReference(8, 92) // Showdown Wins
            Stream.WriteDataReference(10, 90) // Robots à Gogo
            Stream.WriteDataReference(11, 89) // Duo Wins
            Stream.WriteDataReference(12, 88) // 3v3 Wins
            Stream.WriteDataReference(13, 87) // Combat De Boss
            Stream.WriteDataReference(14, 86) // 3v3 Wins
            Stream.WriteDataReference(15, 85) // Victory In Challenges
            Stream.WriteDataReference(16, 84) // 3v3 Wins
            Stream.WriteDataReference(17, 83) // Power League Team Wins
            Stream.WriteDataReference(18, 82) // Power League Solo Wins
            Stream.WriteDataReference(19, 81) // Club League Wins
            Stream.WriteDataReference(21, 80) // 3v3 Wins
            Stream.WriteDataReference(22, 79) // 3v3 Wins
            Stream.WriteDataReference(23, 78) // 3v3 Wins
            Stream.WriteDataReference(26, 77) // Number in Leaderboard
            Stream.WriteDataReference(28, 76) // Old Rank 35s
            Stream.WriteDataReference(20, 300000); // Fame Credits
            Stream.WriteDataReference(24, 13000); // Ranked Points
            Stream.WriteDataReference(25, 13000); // Highest Ranked Points
            Stream.WriteDataReference(27, 2025); // Account Create Date
            Stream.WriteDataReference(29, 2024); // Highest Season Trophies
            Stream.WriteDataReference(30, 1); // Prestige Count
            Stream.WriteDataReference(31, 2039); // Records Points
            Stream.WriteDataReference(32, 12); // Records Rank
        }

        {
            Stream.WriteString("@soufgamev2");
            Stream.WriteVInt(100);
            Stream.WriteVInt(28000000);
            Stream.WriteVInt(43000006);
            Stream.WriteVInt(43000006);
        }

        Stream.WriteBoolean(false);

        Stream.WriteString("hello world");
        Stream.WriteVInt(0);
        Stream.WriteVInt(0);
        Stream.WriteVInt(0);
        Stream.WriteDataReference(29, 0);
        Stream.WriteDataReference(0);
        Stream.WriteDataReference(0);
        Stream.WriteDataReference(0);
        Stream.WriteDataReference(0);

        Stream.WriteBoolean(false);

        Stream.WriteDataReference(25, 0);
        Stream.WriteVInt(1);

        return Stream.Payload;
    }

    static GetMessageType(): number {
        return 24113;
    }
}

export default PlayerProfileMessage;