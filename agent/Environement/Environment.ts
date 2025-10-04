class Environment {
    static script_version: string = "1.0.0";
    static script_branch: string = "dev";
    static process_name: string = "Nulls Brawl"
    static platform: string = "iOS"

    static LaserModule: Module;
    static LaserBase: NativePointer;
    static LaserBaseSize: number;

    static Init() {
        if (Environment.platform == "iOS") {
            Environment.FindModuleByName("NullsBrawl");
            Environment.FindBaseAddress();
            Environment.FindBaseSize();
        }

        if (Environment.platform == "Android") {
            Environment.FindModuleByName("libg.so");
            Environment.FindBaseAddress();
            Environment.FindBaseSize();
        }
    }

    static FindModuleByName(name: string) {
        Environment.LaserModule = Process.getModuleByName(name);
    }

    static FindBaseAddress() {
        Environment.LaserBase = Environment.LaserModule.base;
    }

    static FindBaseSize() {
        Environment.LaserBaseSize = Environment.LaserModule.size;
    }
}

export default Environment;