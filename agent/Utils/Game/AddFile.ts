import Addresses from "../../Manager/Addresses";
import Functions from "../../Manager/Functions";

const {GUI, ResourceManager, GUIContainer, DisplayObject, LogicDataTables, DecoratedTextField, MovieClip, GameButton, MovieClipHelper, Sprite, String, ResourceListenner, Messaging, Stage, ScrollArea, Imports, LogicLaserMessageFactory, LogicGameModeUtil, LogicSkillServer, Application} = Functions;

import StringHelper from "././StringHelper"
import Debugger from "./../Debugger";

import DebugButton from "../../DebugMenu/DebugButton";

class ResourceListener {
    static AddFile(SCFile: string) {
        const SCLoader = Interceptor.attach(Addresses.AddFile, {
            onEnter(args) {
                Debugger.Info("[Loader::LoadDebugSC] Loading debug.sc...");
                ResourceListenner.AddFile(args[0], StringHelper.scptr(SCFile), -1, -1, -1, -1, 0);
                Debugger.Info("[Loader::LoadDebugSC] Loaded debug.sc!");
                setTimeout(() => {
                    DebugButton.LoadDebugButton();
                }, 3000);
                SCLoader.detach()
            }
        })
    }
}

export default ResourceListener