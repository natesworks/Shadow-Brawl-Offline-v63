import Addresses from "./Addresses.js";
import Functions from "./Functions.js";
import PiranhaMessage from "../Protocol/PiranhaMessage/PiranhaMessage.js";
import Debugger from "../Utils/Debugger.js";
import LogicLaserMessageFactory from "../Protocol/Messaging/LogicLaserMessageFactory.js";
import StringHelper from "../Utils/Game/StringHelper.js";
import Environment from "../Environement/Environment.js";
import Messaging from "../Protocol/Messaging/Messaging.js";

import ObjC from "frida-objc-bridge";

class Hooks {
    static InstallHooks() {
        Interceptor.attach(Addresses.ServerConnectionUpdate, {
            onEnter: function (args) {
                this.ServerConnection = args[0];
                this.ServerConnection.add(8).readPointer().add(8).writeU8(0); // Messaging::hasConnectFailed
                this.ServerConnection.add(8).readPointer().add(181).writeInt(5); // Messaging::State
            }
        });

        Interceptor.attach(Addresses.MessageManagerReceiveMessage, {
            onEnter(args) {
                let Message = args[1];
                if (PiranhaMessage.GetMessageType(Message) != 24109) {
                    Debugger.Info("Received " + PiranhaMessage.GetMessageType(Message));
                }
            },
            onLeave(retval) {
                retval.replace(ptr(1));
            }
        });

        Interceptor.replace(Environment.LaserBase.add(0x38FDF0), new NativeCallback(function() { // LogicVersion::isDev
            return 1;
        }, 'int', []));

        Interceptor.replace(Environment.LaserBase.add(0xB62864), new NativeCallback(function() { // Messaging::decryptData
            return 1;
        }, 'int', []));

        Interceptor.attach(Environment.LaserBase.add(0xB63060), { // Messaging::sendPepperAuthentication
		    onEnter(args) {
			    this.messaging = args[0];
                console.warn("[+][PepperState::State][1] Pepper State Is", (Memory as any).readU32(this.messaging.add(24)));
			    (Memory as any).writeU64(this.messaging.add(24), 5);
                args[1] = args[2];
                console.warn("[+][PepperState::State][2] Pepper State Is", (Memory as any).readU32(this.messaging.add(24)));

		    },
		    onLeave(retval) {
			    (Memory as any).writeU64(this.messaging.add(24), 5);
                console.warn("[+][PepperState::State][3] Pepper State Is", (Memory as any).readU32(this.messaging.add(24)));
		    }
	    });

        Interceptor.attach(Environment.LaserBase.add(0xB63744), function() { // Messaging::encryptAndWrite
		    (this.context as any).x0 = (this.context as any).x8;
	    });

        /*Interceptor.attach(Environment.LaserBase.add(0x232658), { // MessageManager::sendMessage
            onEnter(args) {
                // this.message = args[1];
                // PiranhaMessage.Encode(args[1]);
                // this.messaging2 = args[0].add(72).readPointer();
                // this.messaging2.add(24).writeU64(5); // Messaging State                
            }
        });*/

        Interceptor.replace(Addresses.MessagingSend, new NativeCallback(function (Self, Message) {
            const Type = PiranhaMessage.GetMessageType(Message);

            if (Type === 10108) {
                return 0;
            }
                
            if (Type != 24109) {
                Debugger.Info("[Messaging::SendMessage] Type: " + Type);
            }
                
            LogicLaserMessageFactory.CreateMessageByType(Type);
            PiranhaMessage.Destruct(Message);

            return 0;
        }, "int", ["pointer", "pointer"]));

        Interceptor.replace(Environment.LaserBase.add(0xB61904), new NativeCallback(function() {
            return 1;
        }, 'int', []));

        Interceptor.replace(Environment.LaserBase.add(0xB61928), new NativeCallback(function() {
            return 5;
        }, 'int', []));

        // Misc Hooks

        Interceptor.attach(Environment.LaserBase.add(0x325900), {
            onEnter: function (args) {
                // Hooks.messstate.add(24).writeInt(2);
                // args[3] = ptr(3); // Offline Battles
                // args[6] = ptr(1); // Maxed Brawlers
                // args[8] = ptr(0); // Accessorys enabled/disabled
            }
        });

        /*Interceptor.attach(Environment.LaserBase.add(0x496B1C), {
            onEnter: function(args) {
                let Tick = args[0].add(152).readInt();
                let Checksum = args[0].add(156).readInt();
                let CommandsCount = args[0].add(144).readInt();

                Debugger.Debug("[EndClientTurnMessage::decode] Tick: " + Tick);
                Debugger.Debug("[EndClientTurnMessage::decode] Checksum: " + Checksum);
                Debugger.Debug("[EndClientTurnMessage::decode] CommandsCount: " + CommandsCount);
            }
        })*/

        const StringTable__getString = new NativeFunction(Environment.LaserBase.add(0x3703C4), 'pointer', ['pointer']); // ill make it function from the func class later

        let AboutText = `╔════════════════════════╗
<cff1f00>S<cff3f00>h<cff5f00>a<cff7f00>d<cff9f00>o<cffbf00>w<cffdf00> <cffff00>B<cfff000>r<cffe100>a<cffd200>w<cffc300>l<cffb400>┃<cffa500>S<cff9600>H<cff8800>B</c>

<cff0c00>D<cff1800>i<cff2400>s<cff3100>c<cff3d00>o<cff4900>r<cff5600>d<cfe6200>:<cff6e00> <cff7a00>s<cff7b00>o<cfa6e19>u<cf66232>f<cf2564c>g<ced4965>a<ce93d7f>m<ce53198>e<ce024b2>_<cdc18cb>_</c>
<c00f4ff>T<c00edff>e<c00e7ff>l<c00e0ff>e<c00daff>g<c00d3ff>r<c00cdff>a<c00c6ff>m<c00c0ff>:<c00b9ff> <c00b2ff>@<c00b3ff>s<c00b4ff>o<c00b5ff>u<c00b6ff>f<c00b7ff>g<c00b8ff>a<c00b9ff>m<c00baff>e<c00bbff>v<c00bcff>2</c>
<c00f4ff>T<c00edff>e<c00e7ff>l<c00e0ff>e<c00daff>g<c00d3ff>r<c00cdff>a<c00c6ff>m<c00c0ff>:<c00b9ff> <c00b2ff>@<c00b3ff>s<c00b4ff>o<c00b5ff>u<c00b6ff>f<c00b7ff>g<c00b8ff>a<c00b9ff>m<c00baff>e<c00bbff>v<c00bcff>3</c>

Special Thanks:
<c0043ff>N<c0047ff>a<c004bff>t<c004fff>e<c0052ff>s<c0056ff>w<c005aff>o<c005eff>r<c0062ff>k<c0065ff>s<c0069ff> <c006dff>-<c0071ff> <c0074ff>H<c0078ff>e<c007cff>l<c0080ff>p<c0084ff> <c0087ff>f<c008bff>o<c008fff>r<c0093ff> <c0097ff>S<c009aff>e<c009eff>n<c00a2ff>d<c00a6fe>O<c00a9fe>f<c00aaff>f<c00acff>l<c00afff>i<c00b2ff>n<c00b5ff>e<c00b8ff>M<c00bbff>e<c00beff>s<c00c1ff>s<c00c4ff>a<c00c6ff>g<c00c9ff>e<c00ccff> <c00cfff>a<c00d2ff>n<c00d5ff>d<c00d8ff> <c00dbff>B<c00deff>y<c00e0ff>t<c00e3ff>e<c00e6ff>S<c00e9ff>t<c00ecff>r<c00efff>e<c00f2ff>a<c00f5ff>m</c>
<cff0900>G<cff1200>u<cff1b00>d<cff2500> <cff2e00>-<cff3700> <cff4000>A<cff4a00>d<cff5300>d<cff5c00>e<cff6600>d<cfc5c17> <cf9532e>L<cf64a45>o<cf4405c>b<cf13773>b<cee2e8b>y<ceb25a2> <ce91bb9>I<ce612d0>n<ce309e7>f<ce100ff>o</c>

Extra Special Thanks:
SB - <c000cff>M<c0018ff>a<c0024ff>k<c0030ff>i<c003cff>n<c0048ff>g<c0055ff> <c0061ff>a<c006dff> <c0079ff>g<c0085ff>u<c0091ff>i<c009dff>d<c00aaff>e<c00b6ff> <c00c2ff>t<c00ceff>o<c00daff> <c00e6ff>m<c00f2ff>a<c00ffff>k<c00fff2>e<c00ffe6> <c00ffda>B<c00ffce>r<c00ffc2>a<c00ffb6>w<c00ffa9>l<c00ff9d> <c00ff91>S<c00ff85>t<c00ff79>a<c00ff6d>r<c00ff61>s<c00ff54> <c00ff48>O<c00ff3c>f<c00ff30>f<c00ff24>l<c00ff18>i<c00ff0c>n<c00ff00>e</c>
<ce900ff>K<ce500ff>u<ce100ff>b<cc900ff>u<cb100ff>n<c9900ff>e</c> - <c0024ff>R<c0048ff>e<c006dff>v<c0091fe>i<c00b6ff>e<c00daff>w<c00feff>i<c00ffda>n<c00ffb6>g<c00ff91> <c00fe6d>C<c00ff48>o<c00ff24>d<c00ff05>e</c>

Platform: ${Environment.platform}
Version: ${Environment.script_version}
╚════════════════════════╝`

        Interceptor.replace(StringTable__getString, new NativeCallback(function(a1) {
            let value = (Memory as any).readUtf8String(a1);
            if (value === "TID_CONNECTING_TO_SERVER") { // we cant even see it lol the game is loadikg too fast
                return StringTable__getString((Memory as any).allocUtf8String("<cfe0e00>[<cfe1c00>+<cfe2a00>]<cfe3800>[<cfd4600>S<cfd5500>h<cfd6300>a<cfd7100>d<cfd7f00>o<cfc8d00>w<cfc9b00>B<cfcaa00>r<cfcb800>a<cfbc600>w<cfbd400>l<cfbe200>O<cfbf000>f<cfaff00>f<cfbff00>l<cfbf00b>i<cfbe216>n<cfbd421>e<cfbc62c>:<cfcb837>:<cfca942>C<cfc9b4d>o<cfc8d58>n<cfd7f64>n<cfd716f>e<cfd637a>c<cfd5485>t<cfd4690>i<cfe389b>n<cfe2aa6>g<cfe1cb1>]</c>"));
            }
            if (value === "TID_EDIT_CONTROLS") { // i tried making mod menu but it only works when youre not in battles
                return StringTable__getString((Memory as any).allocUtf8String("Battle Settings"));
            }
            if (value === "TID_EDIT_MOVEMENT") { // uhhhhh.. dw
                return StringTable__getString((Memory as any).allocUtf8String("testing"));
            }
            if (value === "TID_ABOUT") { // abput text credits
                return StringTable__getString((Memory as any).allocUtf8String(AboutText));
            }

            return StringTable__getString(a1);
        }, 'pointer', ['pointer']));
        /*
        const DisplayObject_setXY = new NativeFunction(Environment.LaserBase.add(0x9A6760), 'void', ['pointer', 'float', 'float']);
        const GenericPopup_setTitleTid = new NativeFunction(Environment.LaserBase.add(0x186EB0), 'void', ['pointer', 'pointer']);
        const ListContainer_clearEntries = new NativeFunction(Environment.LaserBase.add(0x0AE548), 'void', ['pointer']);

        function ModMenu(a1: NativePointer) {
            new NativeFunction(Environment.LaserBase.add(0x35C50C), 'void', ["pointer"])(a1); // 0x2D3644 // 0x1F550C // 0x0F8A08 // 0x35BC38 // 0x35E340
            GenericPopup_setTitleTid(a1, StringHelper.scptr("Battle Settings"))
            DisplayObject_setXY(a1, 512, 0);
            ListContainer_clearEntries(a1.add(72 * 8).readPointer());

            function CreateModMenuButton() {

            }
        }

        function ShowPopupMenu() {
            const GUI_showPopup = new NativeFunction(Environment.LaserBase.add(0x0A734C), 'void', ['pointer', 'pointer', 'int', 'int', 'int']); // v44.242
	        let ModMenuPopupInstance = Functions.Imports.Malloc(440);
	        ModMenu(ModMenuPopupInstance);
	        GUI_showPopup(Environment.LaserBase.add(0xEE61B8).readPointer(), ModMenuPopupInstance, 0, 0, 0);
        }
        
        Interceptor.replace(Environment.LaserBase.add(0x08C834), new NativeCallback(() => {
            console.log("hi!!!");
            ShowPopupMenu();
            return 1;
        }, 'int', []));*/

        /*function DumpStructure() {
            Interceptor.attach(Environment.LaserBase.add(0x4D92A8), {
                onLeave: function(retval) {
                    console.log("stream.writeBoolean(" + retval.toInt32() + ")");
                }
            });

            Interceptor.attach(Environment.LaserBase.add(0x4D9538), {
                onLeave: function(retval) {
                    console.log("stream.writePositiveVInt(" + retval.toInt32() + ")");
                }
            });

            Interceptor.attach(Environment.LaserBase.add(0x4D9760), {
                onLeave: function(retval) {
                    console.log("stream.writeBoolean(" + retval.toInt32() + ")");
                }
            });
        }

        DumpStructure();*/

        // Credits to gud
        Interceptor.attach(Environment.LaserBase.add(0x31D454), { // HomePage::HomePage
            onEnter: function(args) {
                this.x = args[0];
            },
            onLeave: function(retval) {
                let HomePageInstance = this.x.add(112).readPointer();

                let TextPtr = Functions.Imports.Malloc(524);
                let MovieClip = Functions.ResourceManager.GetMovieClip(StringHelper.ptr("sc/debug.sc"), StringHelper.ptr("debug_menu_text"))

                Functions.GameButton.GameButton(TextPtr);
                new NativeFunction(TextPtr.readPointer().add(352).readPointer(), 'void', ['pointer', 'pointer', 'bool'])(TextPtr, MovieClip, 1);
                Functions.DisplayObject.SetXY(TextPtr, 140, 90);

                TextPtr.add(16).writeFloat(1.65); // height
                TextPtr.add(28).writeFloat(1.65); // width

                let ColorGradientByName2 = Functions.LogicDataTables.GetColorGradientByName(StringHelper.scptr("Name6"), 1);
                let version = Functions.MovieClip.GetTextFieldByName(MovieClip, StringHelper.ptr("Text"));
                Functions.DecoratedTextField.SetupDecoratedText(version, StringHelper.scptr("Shadow Brawl Offline - v63.265\nBy @soufgamev2"), ColorGradientByName2);

                Functions.Sprite.AddChild(HomePageInstance, TextPtr)

                Interceptor.attach(Addresses.CustomButton_buttonPressed, {
			        onEnter(args) {
				        if (TextPtr.toInt32() === (args[0] as NativePointer).toInt32()) {
                            // Functions.Application.OpenUrl(StringHelper.scptr("https://t.me/laserx_framework"));
                            const NSURL = ObjC.classes.NSURL;
                            const NSWorkspace = ObjC.classes.NSWorkspace;

                            const Url = NSURL.URLWithString_("https://t.me/laserx_framework");
                            const Workspace = NSWorkspace.sharedWorkspace();

                            Workspace.openURL_(Url);
                        }
			        }
		        });
            }
        });
    }
};

export default Hooks;
