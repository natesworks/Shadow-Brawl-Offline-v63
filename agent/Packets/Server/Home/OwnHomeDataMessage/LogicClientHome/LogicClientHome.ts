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
    private stream: any;

    static LogicDailyData: any
    static LogicConfData: any

    static NotificationFactory: any

    constructor(stream: any) {
        this.stream = stream

        this.Encode();
    }

    public Encode(): void {
        LogicClientHome.LogicDailyData = LogicDailyData.Encode(this.stream);
        LogicClientHome.LogicConfData = LogicConfData.Encode(this.stream);

        this.stream.WriteLong(0, 1);

        LogicClientHome.NotificationFactory = new NotificationFactory(this.stream);

        this.stream.WriteVInt(1337);

        if (this.stream.WriteBoolean(true)) 
        {
            this.stream.WriteVInt(1);
            {
                LogicGatchaDrop.Encode(this.stream); // LogicGatchDrop::encode
            }
        }
        else 
        {
            this.stream.WriteVInt(0);
        }

        this.stream.WriteVInt(1); // Array
        {
            this.stream.WriteDataReference(0);
        }

        this.stream.WriteVInt(1); // Array
        {
            this.stream.WriteDataReference(0);
            this.stream.WriteDataReference(0);
            this.stream.WriteByte(0);
        }
        
        if (this.stream.WriteBoolean(true)) {
            LogicLoginCalendar.Encode(this.stream);
        }
        if (this.stream.WriteBoolean(true)) {
            LogicLoginCalendar.Encode(this.stream);
        }
        if (this.stream.WriteBoolean(true)) {
            LogicLoginCalendar.Encode(this.stream);
        }
        if (this.stream.WriteBoolean(true)) {
            LogicLoginCalendar.Encode(this.stream);
        }

        LogicHeroGears.Encode(this.stream)

        if (this.stream.WriteBoolean(true)) {
            LogicBrawlerRecruitRoad.Encode(this.stream);
        }

        LogicMastery.Encode(this.stream);
        LogicBattleIntro.Encode(this.stream);
        LogicRandomRewardManager.Encode(this.stream);

        if (this.stream.WriteBoolean(false)) {
            LogicPlayerAlliancePiggyBankData.Encode(this.stream);
        }
        
        if (this.stream.WriteBoolean(true)) {
            LogicPlayerCollabEventData.Encode(this.stream);
        }

        if (this.stream.WriteBoolean(true)) {
            LogicPlayerSpecialEventData.Encode(this.stream);
        }

        LogicDataSeenStates.Encode(this.stream);

        if (this.stream.WriteBoolean(false)) {
            LogicPlayerContestEventData.Encode(this.stream);
        }

        if (this.stream.WriteBoolean(true)) {
            LogicPlayerRecordsData.Encode(this.stream);
        }

        this.stream.WriteBoolean(true);
        {
            this.stream.WriteVInt(0);
            this.stream.WriteVInt(0);
            this.stream.WriteVInt(0);
            this.stream.WriteVInt(0);
            this.stream.WriteVInt(0);
            this.stream.WriteVInt(0);

            this.stream.WriteVInt(1);
            {
                this.stream.WriteBoolean(true);
                {
                    LogicGemOffer.Encode(this.stream, 57, 14888, 0, 0, 0);
                }
            }

            this.stream.WriteVInt(1);
            {
                this.stream.WriteBoolean(true);
                {
                    LogicGemOffer.Encode(this.stream, 57, 14888, 0, 0, 0);
                }
            }
            
            this.stream.WriteVInt(0);
            this.stream.WriteVInt(0);
        }

        this.stream.WriteBoolean(true);
        {
            this.stream.WriteVInt(1);
            {
                this.stream.WriteVInt(0);
                this.stream.WriteVInt(0);
                this.stream.WriteVInt(0);
                this.stream.WriteVInt(0);
                this.stream.WriteVInt(0);
                this.stream.WriteVInt(0);
                this.stream.WriteVInt(0);
                this.stream.WriteVInt(0);
            }
        }

        this.stream.WriteVInt(1); // Array
        {
            this.stream.WriteBoolean(true);
            {
                this.stream.WriteVInt(0);

                this.stream.WriteVInt(0);
                this.stream.WriteVInt(0);
                this.stream.WriteVInt(0);

                this.stream.WriteVInt(0);
                this.stream.WriteVInt(0);
                this.stream.WriteVInt(0);
            }
        }
    }
}

export default LogicClientHome