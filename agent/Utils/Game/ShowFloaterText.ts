import Addresses from "../../Manager/Addresses";
import Functions from "../../Manager/Functions";

import StringHelper from "./StringHelper"

class ShowFloaterText {
    static ShowFloaterTextAtDefaultPos(Text: string, Speed: number, Color: number) {
	    Functions.GUI.ShowFloaterTextAtDefaultPos(Addresses.GUIInstance.readPointer(), StringHelper.scptr(Text), Speed, Color)
    }
    static Execute(Text: string) {
        ShowFloaterText.ShowFloaterTextAtDefaultPos(Text, 0.0, 0xFFFFFFFF);
    }
}

export default ShowFloaterText
