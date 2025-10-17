class ParticleEmittersParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ParticleEmittersParser.Data = csvData;
    }
    static GetName() { return ParticleEmittersParser.Data.map(row => row['Name']); }
    static GetMaxparticlecount() { return ParticleEmittersParser.Data.map(row => row['MaxParticleCount']); }
    static GetMinlife() { return ParticleEmittersParser.Data.map(row => row['MinLife']); }
    static GetMaxlife() { return ParticleEmittersParser.Data.map(row => row['MaxLife']); }
    static GetParticlemininterval() { return ParticleEmittersParser.Data.map(row => row['ParticleMinInterval']); }
    static GetParticlemaxinterval() { return ParticleEmittersParser.Data.map(row => row['ParticleMaxInterval']); }
    static GetParticleminlife() { return ParticleEmittersParser.Data.map(row => row['ParticleMinLife']); }
    static GetParticlemaxlife() { return ParticleEmittersParser.Data.map(row => row['ParticleMaxLife']); }
    static GetParticleminangle() { return ParticleEmittersParser.Data.map(row => row['ParticleMinAngle']); }
    static GetParticlemaxangle() { return ParticleEmittersParser.Data.map(row => row['ParticleMaxAngle']); }
    static GetParticleanglerelativetoparent() { return ParticleEmittersParser.Data.map(row => row['ParticleAngleRelativeToParent']); }
    static GetParticlerandomangle() { return ParticleEmittersParser.Data.map(row => row['ParticleRandomAngle']); }
    static GetParticleminradius() { return ParticleEmittersParser.Data.map(row => row['ParticleMinRadius']); }
    static GetParticlemaxradius() { return ParticleEmittersParser.Data.map(row => row['ParticleMaxRadius']); }
    static GetParticleminspeed() { return ParticleEmittersParser.Data.map(row => row['ParticleMinSpeed']); }
    static GetParticlemaxspeed() { return ParticleEmittersParser.Data.map(row => row['ParticleMaxSpeed']); }
    static GetParticlestartz() { return ParticleEmittersParser.Data.map(row => row['ParticleStartZ']); }
    static GetParticleminvelocityz() { return ParticleEmittersParser.Data.map(row => row['ParticleMinVelocityZ']); }
    static GetParticlemaxvelocityz() { return ParticleEmittersParser.Data.map(row => row['ParticleMaxVelocityZ']); }
    static GetParticlegravity() { return ParticleEmittersParser.Data.map(row => row['ParticleGravity']); }
    static GetParticlemintaillength() { return ParticleEmittersParser.Data.map(row => row['ParticleMinTailLength']); }
    static GetParticlemaxtaillength() { return ParticleEmittersParser.Data.map(row => row['ParticleMaxTailLength']); }
    static GetParticleresource() { return ParticleEmittersParser.Data.map(row => row['ParticleResource']); }
    static GetParticleexportname() { return ParticleEmittersParser.Data.map(row => row['ParticleExportName']); }
    static GetRotatetodirection() { return ParticleEmittersParser.Data.map(row => row['RotateToDirection']); }
    static GetLoopparticleclip() { return ParticleEmittersParser.Data.map(row => row['LoopParticleClip']); }
    static GetStartscale() { return ParticleEmittersParser.Data.map(row => row['StartScale']); }
    static GetEndscale() { return ParticleEmittersParser.Data.map(row => row['EndScale']); }
    static GetFadeoutduration() { return ParticleEmittersParser.Data.map(row => row['FadeOutDuration']); }
    static GetInertia() { return ParticleEmittersParser.Data.map(row => row['Inertia']); }
    static GetEnemyversion() { return ParticleEmittersParser.Data.map(row => row['EnemyVersion']); }
}

export default ParticleEmittersParser;
