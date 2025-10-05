import Addresses from "./Addresses.js";
import Functions from "./Functions.js";
import PiranhaMessage from "../Protocol/PiranhaMessage/PiranhaMessage.js";
import Debugger from "../Utils/Debugger.js";
import LogicLaserMessageFactory from "../Protocol/Messaging/LogicLaserMessageFactory.js";
import StringHelper from "../Utils/Game/StringHelper.js";
import Environment from "../Environement/Environment.js";

class Hooks {
    static InstallHooks() {
        Interceptor.attach(Addresses.ServerConnectionUpdate, {
            onEnter: function (args) {
                this.ServerConnection = args[0];
                this.ServerConnection.add(8).readPointer().add(16).writeU8(0);
                this.ServerConnection.add(8).readPointer().add(181).writeInt(5);
            }
        });

        Interceptor.attach(Addresses.MessageManagerReceiveMessage, {
            onEnter(Args) {
                const Message = Args[1];
                if (PiranhaMessage.GetMessageType(Message) != 24109) {
                    Debugger.Info("Received " + PiranhaMessage.GetMessageType(Message));
                }
            },
            onLeave(Retval) {
                Retval.replace(ptr(1));
            }
        });

        Interceptor.replace(Environment.LaserBase.add(0xB62864), new NativeCallback(function() {
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
			    (Memory as any).writeU32(this.messaging.add(24), 5);
                console.warn("[+][PepperState::State][3] Pepper State Is", (Memory as any).readU32(this.messaging.add(24)));
		    }
	    });

        Interceptor.attach(Environment.LaserBase.add(0xB63744), function() { // Messaging::encryptAndWrite
		    (this.context as any).x0 = (this.context as any).x8;
	    });

        Interceptor.replace(Addresses.MessagingSend,
            new NativeCallback(function (Self, Message) {
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
            }, "int", ["pointer", "pointer"])
        );

        Interceptor.replace(Environment.LaserBase.add(0xB61904), new NativeCallback(function() {
            return 1;
        }, 'int', []));

        // Misc Hooks

        /*Interceptor.attach(Environment.LaserBase.add(0x325900), {
            onEnter: function (args) {
                args[3] = ptr(3); // Offline Battles
                // args[6] = ptr(1); // Maxed Brawlers
                args[8] = ptr(1); // Accessorys enabled/disabled
            }
        });*/

        const StringTable__getString = new NativeFunction(Environment.LaserBase.add(0x3703C4), 'pointer', ['pointer']); // ill make it function from the func class later

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
            if (value === "TID_ABOUT") { // forgot to finish that lol
                return StringTable__getString((Memory as any).allocUtf8String("<cfe0e00>[<cfe1c00>+<cfe2a00>]<cfe3800>[<cfd4600>S<cfd5500>h<cfd6300>a<cfd7100>d<cfd7f00>o<cfc8d00>w<cfc9b00>B<cfcaa00>r<cfcb800>a<cfbc600>w<cfbd400>l<cfbe200>O<cfbf000>f<cfaff00>f<cfbff00>l<cfbf00b>i<cfbe216>n<cfbd421>e<cfbc62c>:<cfcb837>:<cfca942>C<cfc9b4d>o<cfc8d58>n<cfd7f64>n<cfd716f>e<cfd637a>c<cfd5485>t<cfd4690>i<cfe389b>n<cfe2aa6>g<cfe1cb1>]</c>"));
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

        
        Interceptor.attach(Environment.LaserBase.add(0x31D454), { //HomePage::HomePage
            onEnter: function(args) {
                this.x = args[0];
            },
            onLeave: function(retval) {
                let HomePageInstance = this.x.add(0xe * 8).readPointer();

                let TextPtr = Functions.Imports.Malloc(524);
                let MovieClip = Functions.ResourceManager.GetMovieClip(StringHelper.ptr("sc/debug.sc"), StringHelper.ptr("debug_menu_text"))
                console.log(MovieClip);
                Functions.Sprite.Sprite(TextPtr, 1);
                Functions.GUIContainer.SetMovieClip(TextPtr, MovieClip);
                Functions.DisplayObject.SetXY(TextPtr, 120, 90);

                TextPtr.add(16).writeFloat(1.2); //height
                TextPtr.add(28).writeFloat(1.2); //width

                Functions.MovieClip.SetText(MovieClip, StringHelper.ptr("Text"), StringHelper.scptr("hello lobby info\n-gud 🐳"));

                Functions.Sprite.AddChild(HomePageInstance, TextPtr)
            }
        });
    }
};

export default Hooks;
