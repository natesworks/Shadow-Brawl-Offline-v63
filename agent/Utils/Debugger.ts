class Debugger {
	private static readonly Colors = {
		RESET: "\x1b[0m",
		INFO: "\x1b[96;1m",
		WARN: "\x1b[93;1m",
		ERROR: "\x1b[91;1m",
		DEBUG: "\x1b[95;1m",
	} as const;

	private static Format(level: keyof typeof Debugger.Colors, ...messages: string[]): string {
		const color = Debugger.Colors[level];
		const reset = Debugger.Colors.RESET;
		return `${color}[${level}] ${messages.map(m => 
			typeof m === "string" ? m : JSON.stringify(m, null, 2)
		).join(" ")}${reset}`;
	}

	private static Log(level: "INFO" | "WARN" | "ERROR" | "DEBUG", ...messages: string[]): void {
		const fn = console[level.toLowerCase() as keyof Console] as (msg: string) => void;
		fn(Debugger.Format(level, ...messages));
	}

	static Info(...messages: string[]): void {
		Debugger.Log("INFO", ...messages);
	}

	static Warn(...messages: string[]): void {
		Debugger.Log("WARN", ...messages);
	}

	static Error(...messages: string[]): void {
		Debugger.Log("ERROR", ...messages);
	}

	static Debug(...messages: string[]): void {
		Debugger.Log("DEBUG", ...messages);
	}
}

export default Debugger;
