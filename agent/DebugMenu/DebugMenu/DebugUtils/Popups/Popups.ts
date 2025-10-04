import Environment from "../../../../Environement/Environment";

import Addresses from "../../../../Manager/Addresses";
import Functions from "../../../../Manager/Functions";

class Popups {
    static ShowFamePopup() {
        let FamePopupInstance = Functions.Imports.Malloc(1024);
        new NativeFunction(Environment.LaserBase.add(0x18165C), 'void', ["pointer"])(FamePopupInstance);

        Functions.GUI.ShowPopup(Environment.LaserBase.add(0xEE61B8).readPointer(), FamePopupInstance, 0, 0, 0);
    }

    static ShowLatencyTestPopup() {
        let RankedEndPopupInstance = Functions.Imports.Malloc(1024);
        new NativeFunction(Environment.LaserBase.add(0x18CE30), 'void', ["pointer"])(RankedEndPopupInstance);

        Functions.GUI.ShowPopup(Environment.LaserBase.add(0xEE61B8).readPointer(), RankedEndPopupInstance, 1, 0, 1);
    }

    static ShowLatencdzyTestPopup() {
        let RankedEndPopupInstance = Functions.Imports.Malloc(1024);
        new NativeFunction(Environment.LaserBase.add(0x18CE30), 'void', ["pointer"])(RankedEndPopupInstance);

        Functions.GUI.ShowPopup(Environment.LaserBase.add(0xEE61B8).readPointer(), RankedEndPopupInstance, 1, 0, 1);
    }

    static ShowLatencydTestPopup() {
        let RankedEndPopupInstance = Functions.Imports.Malloc(1024);
        new NativeFunction(Environment.LaserBase.add(0x18CE30), 'void', ["pointer"])(RankedEndPopupInstance);

        Functions.GUI.ShowPopup(Environment.LaserBase.add(0xEE61B8).readPointer(), RankedEndPopupInstance, 1, 0, 1);
    }

    static ShowWasabiTestPopup() {
        let RankedEndPopupInstance = Functions.Imports.Malloc(1024);
        new NativeFunction(Environment.LaserBase.add(0x20CF48), 'void', ["pointer"])(RankedEndPopupInstance);

        Functions.GUI.ShowPopup(Environment.LaserBase.add(0xEE61B8).readPointer(), RankedEndPopupInstance, 1, 0, 1);
    }
}

export default Popups