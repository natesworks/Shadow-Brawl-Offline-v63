import Functions from "../../Manager/Functions";
import Addresses from "../../Manager/Addresses";
import StringHelper from "./StringHelper";
import Environment from "../../Environement/Environment";

const {ResourceManager, DisplayObject, LogicDataTables, DecoratedTextField, MovieClip, GameButton, Sprite, Imports, Application} = Functions;

class LobbyInfo {
    static CreateLobbyInfo(a1: NativePointer) {
        let HomePageInstance = a1.add(112).readPointer();

        let TextPtr = Imports.Malloc(524);
        let MovieClipInstance = ResourceManager.GetMovieClip(StringHelper.ptr("sc/debug.sc"), StringHelper.ptr("debug_menu_text"))

        GameButton.GameButton(TextPtr);
        new NativeFunction(TextPtr.readPointer().add(352).readPointer(), 'void', ['pointer', 'pointer', 'bool'])(TextPtr, MovieClipInstance, 1);

        DisplayObject.SetXY(TextPtr, 140, 90);
        TextPtr.add(16).writeFloat(1.65);
        TextPtr.add(28).writeFloat(1.65);

        // DisplayObject.SetHeight(TextPtr, 1.65); 
        // DisplayObject.SetWidth(TextPtr, 1.65);

        let ColorGradientByName2 = LogicDataTables.GetColorGradientByName(StringHelper.scptr("Name6"), 1);
        let version = MovieClip.GetTextFieldByName(MovieClipInstance, StringHelper.ptr("Text"));
        let text = "Shadow Brawl Offline - v63.265\nBy @soufgamev2";
        if (Environment.platform == "Android") text += "\nAndroid offsets by Natesworks"
        DecoratedTextField.SetupDecoratedText(version, StringHelper.scptr(text), ColorGradientByName2);

        Sprite.AddChild(HomePageInstance, TextPtr)

        Interceptor.attach(Addresses.CustomButton_buttonPressed, {
		    onEnter(args) {
			    if (TextPtr.toInt32() === (args[0] as NativePointer).toInt32()) {
                    LobbyInfo.LobbyInfoClicked();
                }
		    }
		});
    }

    static LobbyInfoClicked() {
        Application.OpenURL(StringHelper.scptr("https://t.me/laserx_framework"));
    }
}

export default LobbyInfo