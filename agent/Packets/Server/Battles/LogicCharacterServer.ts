import LogicGameObjectServer from "./LogicGameObjectServer";
import LogicCharacterComponentControllerServer from "./LogicCharacterComponentControllerServer";
import LogicStatusEffectControllerServer from "./LogicStatusEffectControllerServer";
import LogicSkillServer from "./LogicSkillServer";

class LogicCharacterServer {
    static Encode(Stream: any) {
        LogicGameObjectServer.Encode(Stream);

        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);

        Stream.WritePositiveIntMax7(1); // Walk Animation??
        Stream.WriteBoolean(false); // Damage Boost
        Stream.WriteIntMax63(63);

        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WritePositiveIntMax7(0);

        Stream.WritePositiveVIntMax65535OftenZero(0);
        Stream.WritePositiveVIntMax65535OftenZero(0);

        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);

        Stream.WritePositiveVIntMax255OftenZero(0);

        LogicStatusEffectControllerServer.Encode(Stream);
        LogicCharacterComponentControllerServer.Encode(Stream);

        Stream.WritePositiveVIntMax255OftenZero(0);
        Stream.WritePositiveVIntMax2147483647(0);

        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WritePositiveIntMax3(0);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WritePositiveIntMax3(0);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WritePositiveIntMax511(0);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);

        Stream.WritePositiveIntMax31(0);
        Stream.WriteBoolean(false);

        Stream.WritePositiveIntMax3(0);
        Stream.WriteBoolean(false);
        Stream.WriteBoolean(false);
        Stream.WritePositiveIntMax1023(0);
        Stream.WriteBoolean(false);
        Stream.WritePositiveVIntMax65535OftenZero(0);
        Stream.WritePositiveVIntMax2147483647OftenZero(0);
    }
}

export default LogicCharacterServer;
