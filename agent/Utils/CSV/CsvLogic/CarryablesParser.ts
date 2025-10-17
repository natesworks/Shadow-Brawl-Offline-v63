class CarryablesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        CarryablesParser.Data = csvData;
    }
    static GetName() { return CarryablesParser.Data.map(row => row['Name']); }
    static GetThrowoverwalls() { return CarryablesParser.Data.map(row => row['ThrowOverWalls']); }
    static GetThrowfromgroundlevel() { return CarryablesParser.Data.map(row => row['ThrowFromGroundLevel']); }
    static GetMaxz() { return CarryablesParser.Data.map(row => row['MaxZ']); }
    static GetThrowskill() { return CarryablesParser.Data.map(row => row['ThrowSkill']); }
    static GetThrowskillulti() { return CarryablesParser.Data.map(row => row['ThrowSkillUlti']); }
    static GetShouldroll() { return CarryablesParser.Data.map(row => row['ShouldRoll']); }
    static GetBouncing() { return CarryablesParser.Data.map(row => row['Bouncing']); }
    static GetUsearc() { return CarryablesParser.Data.map(row => row['UseArc']); }
    static GetThrowdistancesubtiles() { return CarryablesParser.Data.map(row => row['ThrowDistanceSubTiles']); }
    static GetThrowdistanceultisubtiles() { return CarryablesParser.Data.map(row => row['ThrowDistanceUltiSubTiles']); }
    static GetThrowforce() { return CarryablesParser.Data.map(row => row['ThrowForce']); }
    static GetStatetonormalmovementpromille() { return CarryablesParser.Data.map(row => row['StateToNormalMovementPromille']); }
    static GetThrowforceulti() { return CarryablesParser.Data.map(row => row['ThrowForceUlti']); }
    static GetFlyeffect() { return CarryablesParser.Data.map(row => row['FlyEffect']); }
    static GetFlyeffectulti() { return CarryablesParser.Data.map(row => row['FlyEffectUlti']); }
    static GetMinscale() { return CarryablesParser.Data.map(row => row['MinScale']); }
    static GetMaxscale() { return CarryablesParser.Data.map(row => row['MaxScale']); }
    static GetZoffset() { return CarryablesParser.Data.map(row => row['ZOffset']); }
    static GetShowteamcircle() { return CarryablesParser.Data.map(row => row['ShowTeamCircle']); }
    static GetShowteamcolor() { return CarryablesParser.Data.map(row => row['ShowTeamColor']); }
    static GetAllowownteampickup() { return CarryablesParser.Data.map(row => row['AllowOwnTeamPickup']); }
    static GetPreventpickupintargetbase() { return CarryablesParser.Data.map(row => row['PreventPickupInTargetBase']); }
    static GetPreventpickupfromlasttouchingteam() { return CarryablesParser.Data.map(row => row['PreventPickupFromLastTouchingTeam']); }
    static GetThrowontouch() { return CarryablesParser.Data.map(row => row['ThrowOnTouch']); }
    static GetMinheightforgrab() { return CarryablesParser.Data.map(row => row['MinHeightForGrab']); }
}

export default CarryablesParser;
