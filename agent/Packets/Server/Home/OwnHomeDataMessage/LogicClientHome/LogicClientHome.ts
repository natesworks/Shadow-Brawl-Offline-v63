import ByteStream from "../../../../../DataStream/ByteStream.js";

import LogicConfData from "./LogicConfData/LogicConfData.js";
import LogicDailyData from "./LogicDailyData/LogicDailyData.js";

import LogicRandomRewardManager from "./Arrays/LogicRandomRewardManager.js";
import LogicBattleIntro from "./Arrays/LogicBattleIntro.js";
import LogicMastery from "./Arrays/LogicMastery.js";
import LogicHeroGears from "./Arrays/LogicHeroGears.js";
import LogicBrawlerRecruitRoad from "./Arrays/LogicBrawlerRecruitRoad.js";
import LogicLoginCalendar from "./Arrays/LogicLoginCalendar.js";
import LogicPlayerAlliancePiggyBankData from "./Arrays/LogicPlayerAlliancePiggyBankData.js";
import LogicPlayerCollabEventData from "./Arrays/LogicPlayerCollabEventData.js";
import LogicPlayerSpecialEventData from "./Arrays/LogicPlayerSpecialEventData.js";
import LogicDataSeenStates from "./Arrays/LogicDataSeenStates.js";
import LogicPlayerContestEventData from "./Arrays/LogicPlayerContestEventData.js";
import LogicPlayerRecordsData from "./Arrays/LogicPlayerRecordsData.js";
import LogicGemOffer from "./Arrays/LogicGemOffer.js";
import NotificationFactory from "../NotificationFactory/NotificationFactory.js";
import LogicGatchaDrop from "./Arrays/LogicGatchaDrop.js";

class LogicClientHome {
    static Encode(stream: any): void {
        LogicDailyData.Encode(stream);
        LogicConfData.Encode(stream);

        stream.WriteLong(0, 1);

        NotificationFactory.Encode(stream);

        stream.WriteVInt(1337);

        if (stream.WriteBoolean(true)) 
        {
            stream.WriteVInt(1);
            {
                LogicGatchaDrop.Encode(stream); // LogicGatchDrop::encode
            }
        }
        else 
        {
            stream.WriteVInt(0);
        }

        stream.WriteVInt(1); // Array
        {
            stream.WriteDataReference(0);
        }

        stream.WriteVInt(1); // Array
        {
            stream.WriteDataReference(0);
            stream.WriteDataReference(0);
            stream.WriteByte(0);
        }
        
        if (stream.WriteBoolean(true)) {
            LogicLoginCalendar.Encode(stream);
        }
        if (stream.WriteBoolean(true)) {
            LogicLoginCalendar.Encode(stream);
        }
        if (stream.WriteBoolean(true)) {
            LogicLoginCalendar.Encode(stream);
        }
        if (stream.WriteBoolean(true)) {
            LogicLoginCalendar.Encode(stream);
        }

        LogicHeroGears.Encode(stream)

        if (stream.WriteBoolean(true)) {
            LogicBrawlerRecruitRoad.Encode(stream);
        }

        LogicMastery.Encode(stream);
        LogicBattleIntro.Encode(stream);
        LogicRandomRewardManager.Encode(stream);

        if (stream.WriteBoolean(false)) {
            LogicPlayerAlliancePiggyBankData.Encode(stream);
        }
        
        if (stream.WriteBoolean(true)) {
            LogicPlayerCollabEventData.Encode(stream);
        }

        if (stream.WriteBoolean(true)) {
            LogicPlayerSpecialEventData.Encode(stream);
        }

        LogicDataSeenStates.Encode(stream);

        if (stream.WriteBoolean(false)) {
            LogicPlayerContestEventData.Encode(stream);
        }

        if (stream.WriteBoolean(true)) {
            LogicPlayerRecordsData.Encode(stream);
        }

        stream.WriteBoolean(true);
        {
            stream.WriteVInt(0);
            stream.WriteVInt(0);
            stream.WriteVInt(0);
            stream.WriteVInt(0);
            stream.WriteVInt(0);
            stream.WriteVInt(0);

            stream.WriteVInt(1);
            {
                stream.WriteBoolean(true);
                {
                    LogicGemOffer.Encode(stream, 57, 14888, 0, 0, 0);
                }
            }

            stream.WriteVInt(1);
            {
                stream.WriteBoolean(true);
                {
                    LogicGemOffer.Encode(stream, 57, 14888, 0, 0, 0);
                }
            }
            
            stream.WriteVInt(0);
            stream.WriteVInt(0);
        }

        stream.WriteBoolean(true);
        {
            stream.WriteVInt(1);
            {
                stream.WriteVInt(0);
                stream.WriteVInt(0);
                stream.WriteVInt(0);
                stream.WriteVInt(0);
                stream.WriteVInt(0);
                stream.WriteVInt(0);
                stream.WriteVInt(0);
                stream.WriteVInt(0);
            }
        }

        stream.WriteVInt(1); // Array
        {
            stream.WriteBoolean(true);
            {
                stream.WriteVInt(0);

                stream.WriteVInt(0);
                stream.WriteVInt(0);
                stream.WriteVInt(0);

                stream.WriteVInt(0);
                stream.WriteVInt(0);
                stream.WriteVInt(0);
            }
        }
    }
}

export default LogicClientHome