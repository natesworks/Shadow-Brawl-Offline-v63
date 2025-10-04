import Environment from "../Environement/Environment";
import Functions from "../Manager/Functions";
import BitStream from "../DataStream/BitStream";
import LogicAccessoryData from "./LogicAccessoryData";
import LogicCharacterServer from "./LogicCharacterServer";
import LogicMath from "../Utils/Math/LogicMath";

class LogicAccessory {
    static X = 0;
    static Y = 0;

    static IsOwn = 1;
    static State = 0;
    static ActivationDelay = 0;
    static StartUsingTick = 0;
    static CoolDown = 6;
    static Uses = 3;
    static Angle = 0;
    static IsActive = 0;
    static TicksActive = 0;

    static Type = LogicAccessoryData.Type;
    static ActiveTicks = LogicAccessoryData.ActiveTicks;


    static Init() {
        //LogicAccessory.PlaceHooks();
    }
    
    static PlaceHooks() {
        Interceptor.replace(Environment.LaserBase.add(0x009F34), new NativeCallback(function (a1, a2, a3) {
                return LogicAccessory.Encode(a1, a2, a3);
            }, "void", ["pointer", "pointer", "int"])
        );

        Interceptor.replace(Environment.LaserBase.add(0x43F934), new NativeCallback(function (a1, a2, a3, a4) {
                console.log("nigger")
                return LogicAccessory.TriggerAccessory(a1, a2, a3, a4)
            }, "void", ["pointer", "pointer", "int", "int"])
        );

        Interceptor.replace(Environment.LaserBase.add(0x423850), new NativeCallback(function (a1, a2) {
                return LogicAccessory.UpdateAccessory(a1, a2)
            }, "void", ["pointer", "pointer"])
        );
    }

    static UpdateAccessory(a1: NativePointer, a2: NativePointer) {
        LogicAccessory.State = 1;
        LogicAccessory.CoolDown = LogicMath.Max(0, LogicAccessory.CoolDown - 1);

        if (LogicAccessory.IsActive) 
        {
            if (LogicAccessory.ActivationDelay < 1) 
            {
                if (LogicAccessory.TicksActive >= LogicAccessory.ActiveTicks && LogicAccessory.Type != "ulti_change") {
                    LogicAccessory.IsActive = 1;
                    LogicAccessory.CoolDown = 5;
                } 
                else 
                {
                    LogicAccessory.TickAccessory(a1);
                    LogicAccessory.TicksActive++;
                }
            }
            else 
            {
                LogicAccessory.ActivationDelay--;
                if (LogicAccessory.ActivationDelay == 0) 
                {
                    LogicAccessory.ActivateAccessory(a1)
                }
            }
        }
    }

    static TickAccessory(a1: NativePointer) {
        switch (LogicAccessory.Type)
        {
            case "i dont know":
                
        }
        
    }

    static GetActivationAngle(a1: NativePointer) {
        if (LogicAccessory.X == 0 && LogicAccessory.Y == 0) {

        }
        return LogicMath.GetAngle(LogicAccessory.X , LogicAccessory.Y);
    }

    static ActivateAccessory(a1: NativePointer) {
        const LogicGameObjectServer_GetX = new NativeFunction(Environment.LaserBase.add(0x44E370), 'int', ['pointer']);
        const LogicGameObjectServer_GetY = new NativeFunction(Environment.LaserBase.add(0x44E368), 'int', ['pointer']);
        switch(LogicAccessory.Type) 
        {
            case "dash":
                LogicCharacterServer.TriggerPushback(a1, LogicGameObjectServer_GetX(a1), LogicMath.GetRotatedX(100, 0, LogicAccessory.GetActivationAngle(a1)), LogicGameObjectServer_GetY(a1) - LogicMath.GetRotatedY(1000, 0, LogicAccessory.GetActivationAngle(a1)), 6, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0)
        }
    }

    static TriggerAccessory(a1: NativePointer, a2: NativePointer, a3: number, a4: number) {
        if (LogicAccessory.CoolDown <= 0 && !LogicAccessory.IsActive) {
            LogicAccessory.IsActive = 1;
            LogicAccessory.TicksActive = 0;
            LogicAccessory.ActivateAccessory(a1);
        }
    }
    
    static Encode(a1: NativePointer, a2: NativePointer, a3: number) {
        const BitStream_writePositiveInt = new NativeFunction(Environment.LaserBase.add(0x4DD1B4), 'pointer', ['pointer', 'int', 'int']);
        const BitStream_writePositiveVInt = new NativeFunction(Environment.LaserBase.add(0x4DD444), 'pointer', ['pointer', 'int', 'int']);

        BitStream_writePositiveInt(a2, LogicAccessory.IsActive, 1);
        if (LogicAccessory.IsActive == 1) {
            BitStream_writePositiveVInt(a2, LogicAccessory.CoolDown, 4);
        }

        
        BitStream_writePositiveInt(a2, 0, 1);
        BitStream_writePositiveVInt(a2, 7, 3);
        
        
        if (LogicAccessory.State == 1) {
            BitStream_writePositiveInt(a2, LogicAccessory.StartUsingTick, 14);
            BitStream_writePositiveInt(a2, LogicAccessory.Angle, 9);
        }
        BitStream_writePositiveInt(a2, LogicAccessory.Uses, 3);
    }
}

export default LogicAccessory;
