class LogicOfferBundle {
    static Encode(stream: any): void {
        stream.WriteVInt(0);
    }
}

export default LogicOfferBundle