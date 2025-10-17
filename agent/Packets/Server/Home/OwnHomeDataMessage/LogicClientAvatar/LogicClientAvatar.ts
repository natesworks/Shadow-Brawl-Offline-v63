import LogicPlayerData from "../../../../../Configuration/LogicPlayerData";

class LogicClientAvatar {
    static Encode(stream: any): void {
        stream.WriteVLong(0, 256617006);
        stream.WriteVLong(0, 256617006);
        stream.WriteVLong(0, 0);

        stream.WriteString(LogicPlayerData.GetPlayerName());
        stream.WriteBoolean(true);
        stream.WriteInt(-1);

        stream.WriteVInt(28);

        let OwnedBrawlers = LogicPlayerData.GetOwnedBrawlers();
        let OwnedBrawlersCount = Object.values(OwnedBrawlers).length;
        
        stream.WriteVInt(Object.values(OwnedBrawlers).map(brawler => brawler.CardID).length + 7);
        for (const CardId of Object.values(OwnedBrawlers).map(brawler => brawler.CardID)) {
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
        stream.WriteVInt(67); // Daily Streak Count
        
        stream.WriteVInt(OwnedBrawlersCount);
        for (const CardId of Object.keys(OwnedBrawlers).map(id => parseInt(id))) {
            stream.WriteDataReference(16, CardId);
            stream.WriteVInt(-1);
            stream.WriteVInt(3000);
        }

        stream.WriteVInt(OwnedBrawlersCount);
        for (const CardId of Object.keys(OwnedBrawlers).map(id => parseInt(id))) {
            stream.WriteDataReference(16, CardId);
            stream.WriteVInt(-1);
            stream.WriteVInt(3000);
        }

        stream.WriteVInt(OwnedBrawlersCount);
        for (const CardId of Object.keys(OwnedBrawlers).map(id => parseInt(id))) {
            stream.WriteDataReference(16, CardId);
            stream.WriteVInt(-1);
            stream.WriteVInt(0);
        }

        stream.WriteVInt(OwnedBrawlersCount);
        for (const CardId of Object.keys(OwnedBrawlers).map(id => parseInt(id))) {
            stream.WriteDataReference(16, CardId);
            stream.WriteVInt(-1);
            stream.WriteVInt(3000);
        }

        stream.WriteVInt(OwnedBrawlersCount); // Power Level
        for (const CardId of Object.keys(OwnedBrawlers).map(id => parseInt(id))) {
            stream.WriteDataReference(16, CardId);
            stream.WriteVInt(-1);
            stream.WriteVInt(11 - 1);
        }

        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array
        stream.WriteVInt(0); // Array

        stream.WriteVInt(LogicPlayerData.GetCurrencys().FreeDiamonds);
        stream.WriteVInt(LogicPlayerData.GetCurrencys().Diamonds);
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

    static UseDiamonds(UsedDiamonds: number) {
        LogicPlayerData.GetCurrencys().Diamonds -= UsedDiamonds;
        LogicPlayerData.GetCurrencys().FreeDiamonds -= UsedDiamonds;
    }
}

export default LogicClientAvatar
