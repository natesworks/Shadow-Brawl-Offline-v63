import Addresses from "../../Manager/Addresses";
import Functions from "../../Manager/Functions";

import StringHelper from "./StringHelper"
const {GUI} = Functions;

class ShowFloaterText {
    static ShowFloaterTextAtDefaultPos(Text: string, Speed: number, Color: number) {
	    GUI.ShowFloaterTextAtDefaultPos(Addresses.GUIInstance.readPointer(), StringHelper.scptr(Text), Speed, Color)
    }
    static Execute(Text: string) {
        ShowFloaterText.ShowFloaterTextAtDefaultPos(Text, 0.0, 0xFFFFFFFF);
    }
}

export default ShowFloaterText
