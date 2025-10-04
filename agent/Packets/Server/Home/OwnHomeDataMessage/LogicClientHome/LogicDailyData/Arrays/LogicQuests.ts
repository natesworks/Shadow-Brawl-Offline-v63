class LogicQuests {
    static Encode(stream: any): void {
        stream.WriteVInt(0); // Quests Count
        stream.WriteVInt(10000); // Time Left For Quest Reroll Refresh
        stream.WriteVInt(3); // Quest Rerolls Used
        stream.WriteVInt(0); // Finished Quests Count
    }
}

export default LogicQuests

class BattleEndMessage {
    static Encode(stream: any): void {
        stream.WriteLongLong(0, 0);
        stream.WriteLongLong(0, 0);
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
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
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
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteDataReference(0);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
    }
}


/*
__int64 __fastcall BattleEndMessage::encode(__int64 a1)
{
        stream.WriteLongLong(0);
        stream.WriteLongLong(0);
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
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
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
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteVInt(v2);
  {
    PlayerEntry::encode(0 + v3), a1 + 8);
  }

        stream.WriteVInt(v2);
  {
    XpEntry::encode(0 + v7), a1 + 8);
  }

        stream.WriteVInt(0);
        stream.WriteVInt(0);
  streamHelper.WriteDataReference(0);
        stream.WriteBoolean(false);
  if ( v17 )
    PlayAgainStatus::encode(v17, a1 + 8);

        stream.WriteBoolean(false);
  if ( v18 )
    LogicQuests::encode(v18, a1 + 8);

        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
  if ( v19 )
    LogicRankedMatchRoundState::encode(v19, a1 + 8);

        stream.WriteVInt(0);
        stream.WriteBoolean(false);
  if ( v20 )
    ChronosTextEntry::encode(v20, a1 + 8);
        stream.WriteVInt(0);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
        stream.WriteBoolean(false);
  if ( v21 )
    KudosStatus::encode(v21, a1 + 8);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteBoolean(*(_DWORD *)0 >= 0);
        stream.WriteBoolean(false);
        stream.WriteVInt(0);
  return stream.WriteVInt(0);
}*/