import Environment from "../../../../Environement/Environment";

import Addresses from "../../../../Manager/Addresses";
import Functions from "../../../../Manager/Functions";

import StringHelper from "../../../../Utils/Game/StringHelper";

class Annoucement {
	static OpenImportantAnnoucement() {
		let AnnoucementPopupInstance = Functions.Imports.Malloc(1024);
		Annoucement.AnnoucementPopup(AnnoucementPopupInstance);
		Functions.GUI.ShowPopup(Environment.LaserBase.add(0xEE61B8).readPointer(), AnnoucementPopupInstance, 1, 0, 1);
	}
	static AnnoucementPopup(PopupInstance: NativePointer) {
		const GenericPopup = new NativeFunction(Environment.LaserBase.add(0x186AAC), 'void', ['pointer', 'pointer', 'int', 'int', 'pointer', 'pointer', 'pointer']);
	    const GenericPopup_setTitleTid = new NativeFunction(Environment.LaserBase.add(0x186EB0), 'void', ['pointer', 'pointer']);
        const GenericPopup_addButton = new NativeFunction(Environment.LaserBase.add(0x187E54), 'pointer', ['pointer', 'pointer', 'bool']);

        let s1 = StringHelper.scptr("popup_brawltv");
        let s2 = StringHelper.scptr("sc/ui.sc");
        let s3 = StringHelper.scptr("");
		let s4 = StringHelper.scptr("Important Annoucement");

		GenericPopup(PopupInstance, s1, 0, 0, s3, s3, s3);
		Functions.DisplayObject.SetXY(PopupInstance, 512, 450);
		GenericPopup_setTitleTid(PopupInstance, s3);

        let ok_button = GenericPopup_addButton(PopupInstance, StringHelper.scptr("ok_button"), 1);
        Functions.MovieClip.SetText(PopupInstance, StringHelper.scptr("info_txt"), StringHelper.scptr("i love skibidi toilet sigma"));
        //Functions.MovieClip.GotoAndStopFrameIndex(PopupInstance, 1);
        new NativeFunction(ok_button.readPointer().add(424).readPointer(), 'void', ['pointer', 'pointer', 'bool'])(ok_button, StringHelper.scptr("skibidi toilet"), 1);
		/*new NativeFunction(Environment.LaserBase.add(0x13141C), 'void', ["pointer"])(PopupInstance);*/
		// TID_POPUP_BRAWLTV_TITLE
	}
}

export default Annoucement