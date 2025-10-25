import Environment from "../Environement/Environment";

import Addresses from "../Manager/Addresses";
import Functions from "../Manager/Functions";

const { Stage, Imports } = Functions;

import DebugMenuBase from "./DebugMenuBase";
import StringHelper from "../Utils/Game/StringHelper";


class DebugMenu {
    static DebugMenuInstance: NativePointer

    static NewDebugMenu() {
        if (Environment.platform != "iOS") return; // todo
        DebugMenu.DebugMenuInstance = Imports.Malloc(5200);

        let SCFile = StringHelper.ptr("sc/debug.sc");
        let SCImport = StringHelper.ptr("debug_menu");

        DebugMenuBase.NewDebugMenuBase(DebugMenu.DebugMenuInstance, SCFile, SCImport);
        Stage.AddChild(Addresses.StageInstance.readPointer(), DebugMenu.DebugMenuInstance);
        Stage.AddChild(Addresses.StageInstance.readPointer(), DebugMenuBase.TabScrollArea);
        Stage.AddChild(Addresses.StageInstance.readPointer(), DebugMenuBase.ScrollArea);

        Interceptor.attach(Addresses.GUI_Update, { // GUI::update
            onLeave() {
                DebugMenuBase.update(DebugMenuBase.ScrollArea, 20);
                DebugMenuBase.update(DebugMenuBase.TabScrollArea, 20);
            }
        });
    }
}

export default DebugMenu
