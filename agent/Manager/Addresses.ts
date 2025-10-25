import Environment from "../Environement/Environment";

class Addresses {
    static Imports = class {
        static Malloc: NativePointer;
    }

    static GUI_ShowFloaterTextAtDefaultPos: NativePointer;
    static GUI_showPopup: NativePointer;
    static GUIInstance: NativePointer;
    static StringCtor: NativePointer;
    static HomeMode_Enter: NativePointer;
    static AddFile: NativePointer;
    static StageAddChild: NativePointer;
    static GUIContainer: NativePointer;
    static GUIContainer_setMovieClip: NativePointer;
    static SpriteCtor: NativePointer;
    static Sprite_addChild: NativePointer;
    static DisplayObject_setPixelSnappedXY: NativePointer;
    static DisplayObject_setXY: NativePointer;
    static DisplayObject_setHeight: NativePointer;
    static DisplayObject_setWidth: NativePointer
    static LogicDataTables_getColorGradientByName: NativePointer;
    static DecoratedTextField_setupDecoratedText: NativePointer;
    static MovieClip_getTextFieldByName: NativePointer;
    static ResourceManager_getMovieClip: NativePointer;
    static GUIContainer_createScrollArea: NativePointer;
    static ScrollArea_enablePinching: NativePointer;
    static ScrollArea_enableHorizontalDrag: NativePointer;
    static ScrollArea_enableVerticalDrag: NativePointer;
    static ScrollArea_setAlignment: NativePointer;
    static ScrollArea_update: NativePointer;
    static ScrollArea_addContent: NativePointer;
    static CustomButton_buttonPressed: NativePointer;
    static MovieClip_setText: NativePointer;
    static GameButtonCtor: NativePointer;
    static MovieClipHelper_setTextFieldVerticallyCentered: NativePointer;
    static MovieClipHelper_setTextAndScaleIfNecessary: NativePointer;
    static Application_openUrl: NativePointer;
    static MovieClip_gotoAndStopFrameIndex: NativePointer

    static ServerConnectionUpdate: NativePointer;
    static State: NativePointer;
    static HasConnectFailed: NativePointer;
    static MessagingSend: NativePointer;
    static MessageManagerReceiveMessage: NativePointer;
    static MessageManagerInstance: NativePointer;
    static CreateMessageByType: NativePointer;
    static GetMessageType: NativePointer;
    static Destruct: NativePointer;
    static LogicLaserMessageFactory: NativePointer;
    static Decode: NativePointer;
    static PiranhaMessage: NativePointer;
    static GetLength: NativePointer;
    static LogicConfDataGetIntValue: NativePointer;
    static StringConstructor: NativePointer;
    static PayloadSize: NativePointer;
    static PayloadPtr: NativePointer;
    static LogicVersionIsDev: NativePointer;
    static LogicVersionIsProd: NativePointer;
    static LogicVersionIsDeveloperBuild: NativePointer;
    static MessageLength: NativePointer;
    static ByteStream: NativePointer;
    static Version: NativePointer;
    static LogicGameModeUtil_getPlayerCount: NativePointer;
    static sm_offlineLocation: NativePointer;
    static MovieClip_getMovieClipByName: NativePointer;
    static StringTable_GetString: NativePointer;
    static HomePage_StartGame: NativePointer;
    static HomePageCtor: NativePointer;
    static StageInstance: NativePointer;
    static GUI_Update: NativePointer;
    static MovieClip_GetChildByName: NativePointer;
    static GenericPopupConstructor: NativePointer;
    static GenericPopup_setTitleTid: NativePointer
    static GenericPopup_addButton: NativePointer;

    static InitIOS() {
        Addresses.Imports.Malloc = Process.getModuleByName("libSystem.B.dylib").findExportByName("malloc")!;
        Addresses.GUI_ShowFloaterTextAtDefaultPos = Environment.LaserBase.add(0x0A4984);
        Addresses.GUI_showPopup = Environment.LaserBase.add(0x0A509C);
        Addresses.GUIInstance = Environment.LaserBase.add(0xEC2908);
        Addresses.StringCtor = Environment.LaserBase.add(0xB71488);
        Addresses.HomeMode_Enter = Environment.LaserBase.add(0x31D454);
        Addresses.AddFile = Environment.LaserBase.add(0xA3613C);
        Addresses.StageAddChild = Environment.LaserBase.add(0x9C0FEC);
        Addresses.GUIContainer = Environment.LaserBase.add(0x0A8070);
        Addresses.GUIContainer_setMovieClip = Environment.LaserBase.add(0x0A8454);
        Addresses.SpriteCtor = Environment.LaserBase.add(0x9B7BA4);
        Addresses.Sprite_addChild = Environment.LaserBase.add(0x9B7E20);
        Addresses.DisplayObject_setPixelSnappedXY = Environment.LaserBase.add(0x9A24EC);
        Addresses.DisplayObject_setXY = Environment.LaserBase.add(0x9A24D0);
        Addresses.DisplayObject_setHeight = Environment.LaserBase.add(0x9A2B0C);
        Addresses.DisplayObject_setWidth = Environment.LaserBase.add(0x9A2AC4);
        Addresses.LogicDataTables_getColorGradientByName = Environment.LaserBase.add(0x3EED64);
        Addresses.DecoratedTextField_setupDecoratedText = Environment.LaserBase.add(0x0A1944);
        Addresses.MovieClip_getTextFieldByName = Environment.LaserBase.add(0x9A7E94);
        Addresses.ResourceManager_getMovieClip = Environment.LaserBase.add(0x965038);
        Addresses.GUIContainer_createScrollArea = Environment.LaserBase.add(0x9D7230);
        Addresses.ScrollArea_enablePinching = Environment.LaserBase.add(0x9D849C);
        Addresses.ScrollArea_enableHorizontalDrag = Environment.LaserBase.add(0x9D8524);
        Addresses.ScrollArea_enableVerticalDrag = Environment.LaserBase.add(0x9D8518);
        Addresses.ScrollArea_setAlignment = Environment.LaserBase.add(0x9D8908);
        Addresses.ScrollArea_update = Environment.LaserBase.add(0x9D8194);
        Addresses.ScrollArea_addContent = Environment.LaserBase.add(0x9D7F6C);
        Addresses.CustomButton_buttonPressed = Environment.LaserBase.add(0x9D61D4);
        Addresses.MovieClip_setText = Environment.LaserBase.add(0x9A8094);
        Addresses.GameButtonCtor = Environment.LaserBase.add(0x0A72F0);
        Addresses.MovieClipHelper_setTextFieldVerticallyCentered = Environment.LaserBase.add(0x384960);
        Addresses.MovieClipHelper_setTextAndScaleIfNecessary = Environment.LaserBase.add(0x384CB4);
        Addresses.Application_openUrl = Environment.LaserBase.add(0xB78D80);
        Addresses.MovieClip_getMovieClipByName = Environment.LaserBase.add(0x9A7B8C);
        Addresses.MovieClip_gotoAndStopFrameIndex = Environment.LaserBase.add(0x9A6F60);
        Addresses.ServerConnectionUpdate = Environment.LaserBase.add(0x23AE30);
        Addresses.MessagingSend = Environment.LaserBase.add(0xB6193C);
        Addresses.MessageManagerReceiveMessage = Environment.LaserBase.add(0x232704);
        Addresses.MessageManagerInstance = Environment.LaserBase.add(0xEC2A58);
        Addresses.CreateMessageByType = Environment.LaserBase.add(0x474204);
        Addresses.LogicLaserMessageFactory = Environment.LaserBase.add(0xD93D16);
        Addresses.PiranhaMessage = Environment.LaserBase.add(0x10D4A62);
        Addresses.GetLength = Environment.LaserBase.add(0xa961f8);
        Addresses.LogicConfDataGetIntValue = Environment.LaserBase.add(0xc2fb88);
        Addresses.StringConstructor = Environment.LaserBase.add(0xca8264);
        Addresses.LogicVersionIsDev = Environment.LaserBase.add(0xbc54cc);
        Addresses.LogicVersionIsProd = Environment.LaserBase.add(0x4aa080);
        Addresses.LogicVersionIsDeveloperBuild = Environment.LaserBase.add(0x6c70b8);
        Addresses.LogicGameModeUtil_getPlayerCount = Environment.LaserBase.add(0x4DB678);
        Addresses.sm_offlineLocation = Environment.LaserBase.add(0xEE6740).add(96);
        Addresses.StringTable_GetString = Environment.LaserBase.add(0x3703C4);
        Addresses.HomePage_StartGame = Environment.LaserBase.add(0x325900);
        Addresses.HomePageCtor = Environment.LaserBase.add(0x31D454);
        Addresses.StageInstance = Environment.LaserBase.add(0xF026A8);
        Addresses.GUI_Update = Environment.LaserBase.add(0x0A40B4);
        Addresses.MovieClip_GetChildByName = Environment.LaserBase.add(0x9A6A30);
        Addresses.GenericPopupConstructor = Environment.LaserBase.add(0x184684);
        Addresses.GenericPopup_setTitleTid = Environment.LaserBase.add(0x184A88);
        Addresses.GenericPopup_addButton = Environment.LaserBase.add(0x184F2C);
        Addresses.HasConnectFailed = Environment.LaserBase.add(0xB61904);
    }

    static InitAndroid() {
        Addresses.Imports.Malloc = Process.getModuleByName("libc.so").findExportByName("malloc")!;
        Addresses.GUI_ShowFloaterTextAtDefaultPos = Environment.LaserBase.add(0x4cc0bc);
        Addresses.GUI_showPopup = Environment.LaserBase.add(0x4ccc68);
        Addresses.GUIInstance = Environment.LaserBase.add(0x109b2a0);
        Addresses.StringCtor = Environment.LaserBase.add(0xc44060);
        Addresses.HomeMode_Enter = Environment.LaserBase.add(0x83c680);
        Addresses.AddFile = Environment.LaserBase.add(0xb09228);
        Addresses.StageAddChild = Environment.LaserBase.add(0xab6d6c);
        Addresses.GUIContainer = Environment.LaserBase.add(0xacf674);
        Addresses.GUIContainer_setMovieClip = Environment.LaserBase.add(0xacf8ec);
        Addresses.SpriteCtor = Environment.LaserBase.add(0xaada14);
        Addresses.Sprite_addChild = Environment.LaserBase.add(0xaadc74);
        Addresses.DisplayObject_setPixelSnappedXY = Environment.LaserBase.add(0xa987f4);
        Addresses.DisplayObject_setXY = Environment.LaserBase.add(0xa987d4);
        Addresses.DisplayObject_setHeight = Environment.LaserBase.add(0xa98dcc);
        Addresses.DisplayObject_setWidth = Environment.LaserBase.add(0xa98e18);
        Addresses.LogicDataTables_getColorGradientByName = Environment.LaserBase.add(0x8f3340);
        Addresses.DecoratedTextField_setupDecoratedText = Environment.LaserBase.add(0x4c847c);
        Addresses.MovieClip_getTextFieldByName = Environment.LaserBase.add(0xa9e2b4);
        Addresses.ResourceManager_getMovieClip = Environment.LaserBase.add(0xa70848);
        Addresses.GUIContainer_createScrollArea = Environment.LaserBase.add(0xacfe60);
        Addresses.ScrollArea_enablePinching = Environment.LaserBase.add(0xad1114);
        Addresses.ScrollArea_enableHorizontalDrag = Environment.LaserBase.add(0xad119c);
        Addresses.ScrollArea_enableVerticalDrag = Environment.LaserBase.add(0xad1190);
        Addresses.ScrollArea_setAlignment = Environment.LaserBase.add(0xad15c4);
        Addresses.ScrollArea_update = Environment.LaserBase.add(0xad0e0c);
        Addresses.ScrollArea_addContent = Environment.LaserBase.add(0xad0bdc);
        Addresses.CustomButton_buttonPressed = Environment.LaserBase.add(0xacedd4);
        Addresses.MovieClip_setText = Environment.LaserBase.add(0xa9e4c0);
        Addresses.GameButtonCtor = Environment.LaserBase.add(0x4d1968);
        Addresses.MovieClipHelper_setTextFieldVerticallyCentered = Environment.LaserBase.add(0x86065c);
        Addresses.MovieClipHelper_setTextAndScaleIfNecessary = Environment.LaserBase.add(0x860a34);
        Addresses.Application_openUrl = Environment.LaserBase.add(0xB78D80);
        Addresses.MovieClip_getMovieClipByName = Environment.LaserBase.add(0x8631c8);
        Addresses.MovieClip_gotoAndStopFrameIndex = Environment.LaserBase.add(0xa9d26c);
        Addresses.ServerConnectionUpdate = Environment.LaserBase.add(0x6c2090);
        Addresses.MessagingSend = Environment.LaserBase.add(0xc32cbc);
        Addresses.MessageManagerReceiveMessage = Environment.LaserBase.add(0x6b6b08);
        Addresses.MessageManagerInstance = Environment.LaserBase.add(0x109b910);
        Addresses.CreateMessageByType = Environment.LaserBase.add(0x9a71e0);
        Addresses.LogicLaserMessageFactory = Environment.LaserBase.add(0xfc028e);
        Addresses.PiranhaMessage = Environment.LaserBase.add(0xae9318);
        Addresses.GetLength = Environment.LaserBase.add(0xae0b78);
        Addresses.LogicConfDataGetIntValue = Environment.LaserBase.add(0x9dd9d4);
        Addresses.StringConstructor = Environment.LaserBase.add(0xc44060);
        Addresses.LogicVersionIsDev = Environment.LaserBase.add(0x86cf94);
        Addresses.LogicVersionIsProd = Environment.LaserBase.add(0x86cfa8);
        Addresses.LogicVersionIsDeveloperBuild = Environment.LaserBase.add(0x86d008);
        Addresses.StringTable_GetString = Environment.LaserBase.add(0x84580c);
        Addresses.HomePage_StartGame = Environment.LaserBase.add(0x7eca28);
        Addresses.HomePageCtor = Environment.LaserBase.add(0x7e0abc);
        Addresses.StageInstance = Environment.LaserBase.add(0x10a0500);
        Addresses.GUI_Update = Environment.LaserBase.add(0x4cb67c);
        Addresses.MovieClip_GetChildByName = Environment.LaserBase.add(0xa9ccf4);
        Addresses.GenericPopupConstructor = Environment.LaserBase.add(0x5dfbec);
        Addresses.GenericPopup_setTitleTid = Environment.LaserBase.add(0x5e00d0);
        Addresses.GenericPopup_addButton = Environment.LaserBase.add(0x5e0ad0);
        Addresses.HasConnectFailed = Environment.LaserBase.add(0xc33274);
    }

    static Init() {
        if (Environment.platform == "iOS") {
            this.InitIOS();
        } else {
            this.InitAndroid();
        }
        Addresses.State = ptr(24);
        Addresses.HasConnectFailed = ptr(Process.pointerSize);
        Addresses.GetMessageType = ptr(Process.pointerSize * 5);
        Addresses.Destruct = ptr(Process.pointerSize * 7);
        Addresses.Decode = ptr(3 * Process.pointerSize);
        Addresses.PayloadSize = ptr(Process.pointerSize + Process.pointerSize * 4);
        Addresses.PayloadPtr = ptr(9 * Process.pointerSize);
        Addresses.MessageLength = ptr(Process.pointerSize * 2 + Process.pointerSize * 4 + Process.pointerSize);
        Addresses.ByteStream = ptr(Process.pointerSize * 2);
        Addresses.Version = ptr(136);
    }
}

export default Addresses;
