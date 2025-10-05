import Environment from "../../Environement/Environment";

import Addresses from "../../Manager/Addresses";
import Functions from "../../Manager/Functions";

import StringHelper from "../../Utils/Game/StringHelper";


import Annoucement from "./DebugUtils/MainButtons/Annoucement";
import ReloadGame from "../../Utils/Game/ReloadGame";
import Popups from "./DebugUtils/Popups/Popups";
import Dumper from "./DebugUtils/Dumper/Dumper";
import Debugger from "../../Utils/Debugger";

class DebugMenuBase {
    static TabScrollArea: any
    static ScrollArea: any;
    
    static Buttons: any = [];
    static ButtonsX: number = 0;
    static ButtonsY: number = 20;

    static MiniCategorys: any = [];
    static MiniCategorysX: number = 0;
    static MiniCategorysY: number = 20;

    static Categorys: any = [];
    static CategorysX: number = 0;
    static CategorysY: number = 20;

    static CategoryButtons: any = [];
    static CategoryButtonsX: number = 0;
    static CategoryButtonsY: number = 0;

    static NewDebugMenuBase(Instance: any, SCFile: any, SCImport: any) {
        Functions.Sprite.Sprite(Instance, 1);
        Functions.GUIContainer.GUIContainer(Instance);

        let DebugMenuClip = Functions.ResourceManager.GetMovieClip(SCFile, SCImport);
        Functions.GUIContainer.SetMovieClip(Instance, DebugMenuClip);

        let ColorGradientByName = Functions.LogicDataTables.GetColorGradientByName(StringHelper.scptr("Demons"), 1);
        let title = Functions.MovieClip.GetTextFieldByName(DebugMenuClip, StringHelper.ptr("title"));
        Functions.DecoratedTextField.SetupDecoratedText(title, StringHelper.scptr("Debug Menu"), ColorGradientByName);

        let ColorGradientByName2 = Functions.LogicDataTables.GetColorGradientByName(StringHelper.scptr("Name8"), 1);
        let version = Functions.MovieClip.GetTextFieldByName(DebugMenuClip, StringHelper.ptr("version"));
        Functions.DecoratedTextField.SetupDecoratedText(version, StringHelper.scptr("v63.265"), ColorGradientByName2);

        let ColorGradientByName3 = Functions.LogicDataTables.GetColorGradientByName(StringHelper.scptr("Name4"), 1);
        let search_help = Functions.MovieClip.GetTextFieldByName(DebugMenuClip, StringHelper.ptr("search_help"));
        Functions.DecoratedTextField.SetupDecoratedText(search_help, StringHelper.scptr("@soufgamev2"), ColorGradientByName3);

        let v15 = Functions.Stage.sm_instance.readPointer().add(0x1CD0).readInt() - (Functions.Stage.sm_instance.readPointer().add(84).readFloat() + Functions.Stage.sm_instance.readPointer().add(88).readFloat()) / (Functions.Stage.sm_instance.readPointer().add(0x1C40).readFloat() != 0.0 ? Functions.Stage.sm_instance.readPointer().add(0x1C40).readFloat() : 0.1);
        Functions.DisplayObject.SetXY(Instance, v15, 0);

        let v17 = Functions.GUIContainer.CreateScrollArea(Instance, StringHelper.ptr("tab_area"), 1);
        DebugMenuBase.TabScrollArea = v17;
        v17.add(664).writeU8(1);
        Functions.ScrollArea.EnablePinching(v17, 0);
        Functions.ScrollArea.EnableHorizontalDrag(v17, 1);
        Functions.ScrollArea.EnableVerticalDrag(v17, 0);
        Functions.ScrollArea.SetAlignment(v17, 2);
        Functions.DisplayObject.SetPixelSnappedXY(v17, 730, 73);

        let v18 = Functions.GUIContainer.CreateScrollArea(Instance, StringHelper.ptr("item_area"), 1);
        DebugMenuBase.ScrollArea = v18;
        v18.add(664).writeU8(1);
        Functions.ScrollArea.EnablePinching(v18, 0);
        Functions.ScrollArea.EnableHorizontalDrag(v18, 0);
        Functions.ScrollArea.SetAlignment(v18, 4);
        Functions.DisplayObject.SetPixelSnappedXY(v18, 730, 113);
        
        DebugMenuBase.CreateMiniCategory("", DebugMenuBase.CloseAllCategories);
        DebugMenuBase.CreateMiniCategory("Battles", () => DebugMenuBase.ToggleDebugMenuCategory("Battles"));
        DebugMenuBase.CreateMiniCategory("Dumper", () => DebugMenuBase.ToggleDebugMenuCategory("Dumper"));

        DebugMenuBase.CreateDebugMenuItem("Reload Game", "Plus", ReloadGame.Execute, null);
        DebugMenuBase.CreateDebugMenuItem("Join Telegram", "Name11", ReloadGame.Execute, null);

        let BattlesInstance = DebugMenuBase.CreateDebugMenuCategory("Battles", "Name6", () => DebugMenuBase.ToggleDebugMenuCategory("Battles"));

        DebugMenuBase.CreateDebugMenuItem("Infinite Ulti", "Name6", Popups.ShowFamePopup, "Battles", BattlesInstance);

        let DumperInstance = DebugMenuBase.CreateDebugMenuCategory("Dumper", "Name9", () => DebugMenuBase.ToggleDebugMenuCategory("Dumper"));

        DebugMenuBase.CreateDebugMenuItem("Dump OHD", "Name9", Dumper.DumpOHD, "Dumper", DumperInstance);
        DebugMenuBase.CreateDebugMenuItem("Dump Battle Struct", "Name9", Dumper.DumpBattles, "Dumper", DumperInstance);
        
        DebugMenuBase.updateLayout();
    }

    static update(ScrollArea: NativePointer, FramePer: number) {
        Functions.ScrollArea.Update(ScrollArea, FramePer);
    }
    
    static updateLayout() {
        let currentY = 20;
        
        const allButtons = DebugMenuBase.Buttons.concat(DebugMenuBase.Categorys);
        allButtons.sort((a: any, b: any) => a.creationOrder - b.creationOrder);

        for (const button of allButtons) {
            Functions.DisplayObject.SetPixelSnappedXY(button, 145, currentY + 10);
            (button as any).Y = currentY + 10;
            currentY += 55;

            if ((button as any).isExpanded) {
                const categoryButtons = DebugMenuBase.CategoryButtons.filter((btn: any) => btn.categoryName === (button as any).Text);
                for (const subButton of categoryButtons) {
                    subButton.add(8).writeU8(1);
                    Functions.DisplayObject.SetPixelSnappedXY(subButton, 145, currentY + 10);
                    currentY += 55;
                }
            } else {
                 const categoryButtons = DebugMenuBase.CategoryButtons.filter((btn: any) => btn.categoryName === (button as any).Text);
                 for (const subButton of categoryButtons) {
                    subButton.add(8).writeU8(0);
                 }
            }
        }
    }

    static CreateMiniCategory(Text: string, Callback: any) {
        let ButtonInstance = Functions.Imports.Malloc(1000);
        let GameButton = Functions.GameButton.GameButton(ButtonInstance);
        let MovieClip = Functions.ResourceManager.GetMovieClip(StringHelper.ptr('sc/debug.sc'), StringHelper.ptr('debug_menu_category_mini'));
        new NativeFunction(ButtonInstance.readPointer().add(352).readPointer(), 'void', ['pointer', 'pointer', 'bool'])(ButtonInstance, MovieClip, 1);
        let TextField = Functions.MovieClip.GetTextFieldByName(MovieClip, StringHelper.ptr("Text"));
        Functions.MovieClipHelper.SetTextAndScaleIfNecessary(TextField, StringHelper.scptr(Text), 1, 0)
        Functions.MovieClip.SetText(MovieClip, StringHelper.ptr("Text"), StringHelper.scptr(Text));
        Functions.DisplayObject.SetPixelSnappedXY(ButtonInstance, 20 + DebugMenuBase.MiniCategorysX, 20);
        DebugMenuBase.MiniCategorysX += 45;

        Functions.ScrollArea.AddContent(DebugMenuBase.TabScrollArea, ButtonInstance);

        Interceptor.attach(Addresses.CustomButton_buttonPressed, {
            onEnter(args) {
                if (ButtonInstance.toInt32() === args[0].toInt32()) {
                    Callback();
                }
            }
        });
        return ButtonInstance;
    }

    static CreateDebugMenuItem(Text: string, ColorGradient: string, Callback: any, CategoryName: any, CategoryButton: any = null) {
        let ButtonInstance = Functions.Imports.Malloc(1000);
        let GameButton = Functions.GameButton.GameButton(ButtonInstance);
        let MovieClip = Functions.ResourceManager.GetMovieClip(StringHelper.ptr('sc/debug.sc'), StringHelper.ptr('debug_menu_item'));
        new NativeFunction(ButtonInstance.readPointer().add(352).readPointer(), 'void', ['pointer', 'pointer', 'bool'])(ButtonInstance, MovieClip, 1);
        let TextField = Functions.MovieClip.GetTextFieldByName(MovieClip, StringHelper.ptr("Text"));

        let ColorGradientByName2 = Functions.LogicDataTables.GetColorGradientByName(StringHelper.scptr(ColorGradient), 1);
        Functions.MovieClipHelper.SetTextAndScaleIfNecessary(TextField, StringHelper.scptr(Text), 1, 0)
        Functions.DecoratedTextField.SetupDecoratedText(TextField, StringHelper.scptr(Text), ColorGradientByName2);
        Functions.MovieClip.SetText(MovieClip, StringHelper.ptr("Text"), StringHelper.scptr(Text));
        Functions.MovieClipHelper.SetTextFieldVerticallyCentered(TextField);

        Functions.ScrollArea.AddContent(DebugMenuBase.ScrollArea, ButtonInstance);

        Interceptor.attach(Addresses.CustomButton_buttonPressed, {
            onEnter(args) {
                if (ButtonInstance.toInt32() === args[0].toInt32()) {
                    Callback();
                }
            }
        });

        if (CategoryName == null) {
            (ButtonInstance as any).creationOrder = DebugMenuBase.Buttons.length;
            DebugMenuBase.Buttons.push(ButtonInstance);
        }
        else {
            (ButtonInstance as any).categoryName = CategoryName;
            (ButtonInstance as any).categoryButton = CategoryButton;
            DebugMenuBase.CategoryButtons.push(ButtonInstance);
            ButtonInstance.add(8).writeU8(0);
        }

        return ButtonInstance;
    }

    static CreateDebugMenuCategory(Text: string, ColorGradient: string, Callback: any) {
        let ButtonInstance = Functions.Imports.Malloc(1000);
        let GameButton = Functions.GameButton.GameButton(ButtonInstance);
        let MovieClip = Functions.ResourceManager.GetMovieClip(StringHelper.ptr('sc/debug.sc'), StringHelper.ptr('debug_menu_category'));
        new NativeFunction(ButtonInstance.readPointer().add(352).readPointer(), 'void', ['pointer', 'pointer', 'bool'])(ButtonInstance, MovieClip, 1);
        let TextField = Functions.MovieClip.GetTextFieldByName(MovieClip, StringHelper.ptr("Text"));

        let ColorGradientByName2 = Functions.LogicDataTables.GetColorGradientByName(StringHelper.scptr(ColorGradient), 1);
        Functions.DecoratedTextField.SetupDecoratedText(TextField, StringHelper.scptr(Text), ColorGradientByName2);
        Functions.MovieClip.SetText(MovieClip, StringHelper.ptr("Text"), StringHelper.scptr("+ " + Text));
        
        Functions.MovieClipHelper.SetTextFieldVerticallyCentered(TextField);
        (ButtonInstance as any).Text = Text;
        (ButtonInstance as any).MovieClip = MovieClip;
        (ButtonInstance as any).isExpanded = false;
        (ButtonInstance as any).creationOrder = DebugMenuBase.Buttons.length + DebugMenuBase.Categorys.length;
        DebugMenuBase.Categorys.push(ButtonInstance);

        Functions.ScrollArea.AddContent(DebugMenuBase.ScrollArea, ButtonInstance);

        Interceptor.attach(Addresses.CustomButton_buttonPressed, {
            onEnter(args) {
                if (ButtonInstance.toInt32() === args[0].toInt32()) {
                    Callback();
                }
            }
        });
        return ButtonInstance;
    }

    static CloseAllCategories() {
        DebugMenuBase.Categorys.forEach((category: any) => {
            if (category.isExpanded) {
                category.isExpanded = false;
                const movieClip = category.MovieClip;
                Functions.MovieClip.SetText(movieClip, StringHelper.ptr("Text"), StringHelper.scptr("+ " + category.Text));
            }
        });
        DebugMenuBase.updateLayout();
    }
    
    static ToggleDebugMenuCategory(CategoryName: string) {
        const categoryButton = DebugMenuBase.Categorys.find((btn: any) => btn.Text === CategoryName);
        if (!categoryButton) return;
        (categoryButton as any).isExpanded = !(categoryButton as any).isExpanded;
        const movieClip = (categoryButton as any).MovieClip;
        const prefix = (categoryButton as any).isExpanded ? "- " : "+ ";
        Functions.MovieClip.SetText(movieClip, StringHelper.ptr("Text"), StringHelper.scptr(prefix + CategoryName));
        DebugMenuBase.updateLayout();
    }
}

export default DebugMenuBase
