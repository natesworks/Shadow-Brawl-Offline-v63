import Addresses from "../../Manager/Addresses";
import Functions from "../../Manager/Functions";

import StringHelper from "./StringHelper"
const {GUI, ResourceManager, GUIContainer, DisplayObject, LogicDataTables, DecoratedTextField, MovieClip, GameButton, MovieClipHelper, Sprite, String, ResourceListenner, Stage, ScrollArea, Imports, LogicLaserMessageFactory, Messaging, LogicGameModeUtil, LogicSkillServer, Application} = Functions;

class ShowFloaterText {
    static ShowFloaterTextAtDefaultPos(Text: string, Speed: number, Color: number) {
	    GUI.ShowFloaterTextAtDefaultPos(Addresses.GUIInstance.readPointer(), StringHelper.scptr(Text), Speed, Color)
    }
    static Execute(Text: string) {
        ShowFloaterText.ShowFloaterTextAtDefaultPos(Text, 0.0, 0xFFFFFFFF);
    }
}

export default ShowFloaterText
