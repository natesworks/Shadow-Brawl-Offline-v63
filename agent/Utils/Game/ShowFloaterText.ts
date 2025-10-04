import Addresses from "../../Manager/Addresses";
import Functions from "../../Manager/Functions";

import StringHelper from "./StringHelper"

class ShowFloaterText {
    static ShowFloaterTextAtDefaultPos(Text: string, Color: number, Speed: number) {
	    Functions.GUI.ShowFloaterTextAtDefaultPos(Addresses.GUIInstance.readPointer(), StringHelper.scptr(Text), Color, Speed)
    }
    static Execute(Text: string) {
        ShowFloaterText.ShowFloaterTextAtDefaultPos(Text, -1, 0.0);
    }
}

export default ShowFloaterText