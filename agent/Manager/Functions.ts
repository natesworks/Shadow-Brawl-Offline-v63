import Environment from "../Environement/Environment";
import Addresses from "./Addresses";

class Functions {
    static GUI = class {
        static ShowFloaterTextAtDefaultPos: any;
        static ShowPopup: any;
        static GetInstance: any;
    };

    static ResourceManager = class {
        static GetMovieClip: any;
    }

    static GUIContainer = class {
        static GUIContainer: any;
        static SetMovieClip: any;
        static CreateScrollArea: any;
    }

    static DisplayObject = class {
        static SetPixelSnappedXY: any;
        static SetXY: any;
        static SetHeight: any
        static SetWidth: any
    }

    static LogicDataTables = class {
        static GetColorGradientByName: any;
    }

    static DecoratedTextField = class {
        static SetupDecoratedText: any;
    }

    static MovieClip = class {
        static GetTextFieldByName: any;
        static SetText: any;
        static GetMovieClipByName: any;
        static GotoAndStopFrameIndex: any;
    }

    static GameButton = class {
        static GameButton: any;
    }

    static MovieClipHelper = class {
        static SetTextFieldVerticallyCentered: any;
        static SetTextAndScaleIfNecessary: any;
    }

    static Sprite = class {
        static Sprite: any;
        static AddChild: any;
    }

    static String = class {
        static StringCtor: any;
    }

    static ResourceListenner = class {
        static AddFile: any;
    }

    static Stage = class {
        static AddChild: any;
        static sm_instance: NativePointer;
    }

    static ScrollArea = class {
        static EnablePinching: any;
        static EnableHorizontalDrag: any;
        static EnableVerticalDrag: any;
        static SetAlignment: any;
        static Update: any;
        static AddContent: any;
    }

    static Imports = class {
        static Malloc: any;
        static Free: any;
        static Open: any;
        static Read: any;
        static Write: any;
        static Close: any;
        static Mkdir: any;
    }

    static LogicLaserMessageFactory = class {
        static CreateMessageByType: any;
    }

    static Messaging = class {
        static ReceiveMessage: any;
        static Send: any;
    }
    
    static LogicGameModeUtil = class {
        static GetPlayerCount: any
    }

    static LogicSkillServer = class {
        static Constructor: any
        static Destructor: any
    }

    static Application = class {
        static OpenURL: any
    }

    static Init() {
        const LibSystem = Process.getModuleByName("libSystem.B.dylib");

        Functions.GUI.ShowFloaterTextAtDefaultPos = new NativeFunction(Addresses.GUI_ShowFloaterTextAtDefaultPos, 'void', ['pointer', 'pointer', 'float', 'int']);
        Functions.GUI.ShowPopup = new NativeFunction(Addresses.GUI_showPopup, 'void', ['pointer', 'pointer', 'int', 'int', 'int']);
        Functions.GUI.GetInstance = new NativeFunction(Addresses.GUIInstance, 'pointer', []);
        Functions.ResourceManager.GetMovieClip = new NativeFunction(Addresses.ResourceManager_getMovieClip, 'pointer', ['pointer', 'pointer']);
        Functions.GUIContainer.GUIContainer = new NativeFunction(Addresses.GUIContainer, 'void', ['pointer']);
        Functions.GUIContainer.SetMovieClip = new NativeFunction(Addresses.GUIContainer_setMovieClip, 'void', ['pointer', 'pointer']);
        Functions.GUIContainer.CreateScrollArea = new NativeFunction(Addresses.GUIContainer_createScrollArea, 'pointer', ['pointer', 'pointer', 'int']);
        Functions.DisplayObject.SetPixelSnappedXY = new NativeFunction(Addresses.DisplayObject_setPixelSnappedXY, 'float', ['pointer', 'float', 'float']);
        Functions.DisplayObject.SetXY = new NativeFunction(Addresses.DisplayObject_setXY, 'float', ['pointer', 'float', 'float']);
        Functions.DisplayObject.SetHeight = new NativeFunction(Addresses.DisplayObject_setHeight, 'float', ['pointer', 'float']);
        Functions.DisplayObject.SetWidth = new NativeFunction(Addresses.DisplayObject_setWidth, 'float', ['pointer', 'float']);
        Functions.LogicDataTables.GetColorGradientByName = new NativeFunction(Addresses.LogicDataTables_getColorGradientByName, 'pointer', ['pointer', 'int']);
        Functions.DecoratedTextField.SetupDecoratedText = new NativeFunction(Addresses.DecoratedTextField_setupDecoratedText, 'void', ['pointer', 'pointer', 'pointer']);
        Functions.MovieClip.GetTextFieldByName = new NativeFunction(Addresses.MovieClip_getTextFieldByName, 'pointer', ['pointer', 'pointer']);
        Functions.MovieClip.SetText = new NativeFunction(Addresses.MovieClip_setText, 'void', ['pointer', 'pointer', 'pointer']);
        Functions.MovieClipHelper.SetTextFieldVerticallyCentered = new NativeFunction(Addresses.MovieClipHelper_setTextFieldVerticallyCentered, 'void', ['pointer']);
        Functions.Sprite.Sprite = new NativeFunction(Addresses.SpriteCtor, 'void', ['pointer', 'int']);
        Functions.String.StringCtor = new NativeFunction(Addresses.StringCtor, 'void', ['pointer', 'pointer']);
        Functions.Sprite.AddChild = new NativeFunction(Addresses.Sprite_addChild, 'pointer', ['pointer', 'pointer']);
        Functions.ResourceListenner.AddFile = new NativeFunction(Addresses.AddFile, 'int', ['pointer', 'pointer', 'int', 'int', 'int', 'int', 'int']);
        Functions.Stage.AddChild = new NativeFunction(Addresses.StageAddChild, 'pointer', ['pointer', 'pointer']);
        Functions.Stage.sm_instance = Environment.LaserBase.add(0xF026A8);
        Functions.ScrollArea.EnablePinching = new NativeFunction(Addresses.ScrollArea_enablePinching, 'void', ['pointer', 'int']);
        Functions.ScrollArea.EnableHorizontalDrag = new NativeFunction(Addresses.ScrollArea_enableHorizontalDrag, 'void', ['pointer', 'int']);
        Functions.ScrollArea.EnableVerticalDrag = new NativeFunction(Addresses.ScrollArea_enableVerticalDrag, 'void', ['pointer', 'int']);
        Functions.ScrollArea.SetAlignment = new NativeFunction(Addresses.ScrollArea_setAlignment, 'void', ['pointer', 'int']);
        Functions.ScrollArea.Update = new NativeFunction(Addresses.ScrollArea_update, 'void', ['pointer', 'int']);
        Functions.ScrollArea.AddContent = new NativeFunction(Addresses.ScrollArea_addContent, 'void', ['pointer', 'pointer'])
        Functions.GameButton.GameButton = new NativeFunction(Addresses.GameButtonCtor, 'void', ['pointer'])
        Functions.MovieClipHelper.SetTextAndScaleIfNecessary = new NativeFunction(Addresses.MovieClipHelper_setTextAndScaleIfNecessary, 'void', ['pointer', 'pointer', 'int', 'int']);
        Functions.Application.OpenURL = new NativeFunction(Addresses.Application_openUrl, 'void', ['pointer']);
        Functions.MovieClip.GetMovieClipByName = new NativeFunction(Addresses.MovieClip_getMovieClipByName, 'pointer', ['pointer', 'pointer']);
        Functions.MovieClip.GotoAndStopFrameIndex = new NativeFunction(Addresses.MovieClip_gotoAndStopFrameIndex, 'void', ['pointer', 'int']),

        Functions.Imports.Malloc = new NativeFunction(Addresses.Imports.Malloc, 'pointer', ["uint"]);
        Functions.Imports.Free = new NativeFunction(LibSystem.findExportByName("free")!, "int", ["pointer"]);
        Functions.Imports.Open = new NativeFunction(LibSystem.findExportByName("open")!, "int", ["pointer", "int", "int"]);
        Functions.Imports.Read = new NativeFunction(LibSystem.findExportByName("read")!, "int", ["int", "pointer", "int"]);
        Functions.Imports.Write = new NativeFunction(LibSystem.findExportByName("write")!, "int", ["int", "pointer", "int"]);
        Functions.Imports.Close = new NativeFunction(LibSystem.findExportByName("close")!, "int", ["int"]);
        Functions.Imports.Mkdir = new NativeFunction(LibSystem.findExportByName("mkdir")!, "int", ["pointer", "uint32"]);

        Functions.LogicLaserMessageFactory.CreateMessageByType = new NativeFunction(Addresses.CreateMessageByType, "pointer", ["pointer", "int"]);
        Functions.Messaging.ReceiveMessage = new NativeFunction(Addresses.MessageManagerReceiveMessage, "int", ["pointer", "pointer"]);
        Functions.Messaging.Send = new NativeFunction(Addresses.MessagingSend, "int", ["pointer", "pointer"]);
        Functions.LogicGameModeUtil.GetPlayerCount = new NativeFunction(Addresses.LogicGameModeUtil_getPlayerCount, 'int', ['pointer']);

        Functions.LogicSkillServer.Constructor = new NativeFunction(Addresses.LogicSkillServerCtor, 'pointer', ['pointer', 'pointer']);
        Functions.LogicSkillServer.Destructor = new NativeFunction(Addresses.LogicSkillServerDtor, 'pointer', ['pointer']);
    }
}

export const {
    GUI,
    ResourceManager,
    GUIContainer,
    DisplayObject,
    LogicDataTables,
    DecoratedTextField,
    MovieClip,
    GameButton,
    MovieClipHelper,
    Sprite,
    String,
    ResourceListenner,
    Stage,
    ScrollArea,
    Imports,
    LogicLaserMessageFactory,
    Messaging,
    LogicGameModeUtil,
    LogicSkillServer,
    Application
} = Functions;

export default Functions;
