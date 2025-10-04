import LogicPlayerData from "../../../../../Configuration/LogicPlayerData";

class LogicClientAvatar {
    static Encode(stream: any): void {
        stream.WriteVLong(0, 254842734);
        stream.WriteVLong(0, 254842734);
        stream.WriteVLong(0, 0);

        stream.WriteString("@soufgamev2");
        stream.WriteBoolean(true);
        stream.WriteInt(-1);

        stream.WriteVInt(28);

        let OwnedBrawlersCount = Object.values(LogicPlayerData.OwnedBrawlers).length
        stream.WriteVInt(Object.values(LogicPlayerData.OwnedBrawlers).map(brawler => brawler.CardID).length + 7);
        for (const CardId of Object.values(LogicPlayerData.OwnedBrawlers).map(brawler => brawler.CardID)) {
            stream.WriteDataReference(23, CardId);
            stream.WriteVInt(-1);
            stream.WriteVInt(1);
        }

        stream.WriteDataReference(5, 8);
        stream.WriteVInt(-1);
        stream.WriteVInt(300000);

        stream.WriteDataReference(5, 9);
        stream.WriteVInt(-1);
        stream.WriteVInt(300000);

        stream.WriteDataReference(5, 21);
        stream.WriteVInt(-1);
        stream.WriteVInt(300000);

        stream.WriteDataReference(5, 22);
        stream.WriteVInt(-1);
        stream.WriteVInt(300000);

        stream.WriteDataReference(5, 23);
        stream.WriteVInt(-1);
        stream.WriteVInt(300000);

        stream.WriteDataReference(5, 24);
        stream.WriteVInt(-1);
        stream.WriteVInt(300000);

        stream.WriteDataReference(5, 25);
        stream.WriteVInt(-1);
        stream.WriteVInt(67);
        
        stream.WriteVInt(OwnedBrawlersCount);
        for (const CardId of Object.keys(LogicPlayerData.OwnedBrawlers).map(id => parseInt(id))) {
            stream.WriteDataReference(16, CardId);
            stream.WriteVInt(-1);
            stream.WriteVInt(3000);
        }

        stream.WriteVInt(OwnedBrawlersCount);
        for (const CardId of Object.keys(LogicPlayerData.OwnedBrawlers).map(id => parseInt(id))) {
            stream.WriteDataReference(16, CardId);
            stream.WriteVInt(-1);
            stream.WriteVInt(3000);
        }

        stream.WriteVInt(OwnedBrawlersCount);
        for (const CardId of Object.keys(LogicPlayerData.OwnedBrawlers).map(id => parseInt(id))) {
            stream.WriteDataReference(16, CardId);
            stream.WriteVInt(-1);
            stream.WriteVInt(0);
        }

        stream.WriteVInt(OwnedBrawlersCount);
        for (const CardId of Object.keys(LogicPlayerData.OwnedBrawlers).map(id => parseInt(id))) {
            stream.WriteDataReference(16, CardId);
            stream.WriteVInt(-1);
            stream.WriteVInt(3000);
        }

        stream.WriteVInt(OwnedBrawlersCount);
        for (const CardId of Object.keys(LogicPlayerData.OwnedBrawlers).map(id => parseInt(id))) {
            stream.WriteDataReference(16, CardId);
            stream.WriteVInt(-1);
            stream.WriteVInt(11 - 1);
        }

        stream.WriteVInt(0); // hero star power gadget and hypercharge

        stream.WriteVInt(0)

        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
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
        stream.WriteVInt(0);

        stream.WriteVInt(1000000);
        stream.WriteVInt(1000000);
        stream.WriteVInt(10);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(2);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteString("");
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
    }
}

export default LogicClientAvatar