class LogicLongUtil {
	static GetHigherInt(Value: bigint): number {
		return Number(Value >> 32n);
	}

	static GetLowerInt(Value: bigint): number {
		return Number(Value & 0xFFFFFFFFn);
	}
}

export default LogicLongUtil