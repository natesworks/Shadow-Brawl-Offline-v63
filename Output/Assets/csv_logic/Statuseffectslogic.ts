class Statuseffectslogic {
    static Whirlwindtrailfire = class {
        static Name = "WhirlwindTrailFire"
        static Durationticks = 80
        static Triggerrate = 20
        static Refreshable = true
        static Damage = 300
        static Ultichargepercent = 30
        static Scalewithupgrades = true
        static Isdebuff = true
        static RowID = 1
    }
    static Whirlwindultitrailfire = class {
        static Name = "WhirlwindUltiTrailFire"
        static Durationticks = 80
        static Triggerrate = 20
        static Refreshable = true
        static Damage = 370
        static Ultichargepercent = 30
        static Scalewithupgrades = true
        static Isdebuff = true
        static RowID = 2
    }
    static Petrolfire = class {
        static Name = "PetrolFire"
        static Durationticks = 80
        static Triggerrate = 20
        static Refreshable = true
        static Damage = 480
        static Ultichargepercent = 100
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 3
    }
    static Petrolfireovercharged = class {
        static Name = "PetrolFireOvercharged"
        static Durationticks = 80
        static Triggerrate = 20
        static Refreshable = true
        static Damage = 500
        static Ultichargepercent = 100
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 4
    }
    static Rollerfire = class {
        static Name = "RollerFire"
        static Durationticks = 80
        static Triggerrate = 20
        static Refreshable = true
        static Damage = 200
        static Ultichargepercent = 100
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 5
    }
    static Puppeteerpoison = class {
        static Name = "PuppeteerPoison"
        static Durationticks = 40
        static Triggerrate = 20
        static Triggeronfirsttick = true
        static Stacking = true
        static Damage = 400
        static Ultichargepercent = 100
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static Hapticstosource = true
        static RowID = 6
    }
    static Sharpenedammobleed = class {
        static Name = "SharpenedAmmoBleed"
        static Durationticks = 60
        static Triggerrate = 20
        static Isdebuff = true
        static RowID = 7
    }
    static Collabassassinbleed = class {
        static Name = "CollabAssassinBleed"
        static Durationticks = 120
        static Triggerrate = 20
        static Damage = 65
        static Ultichargepercent = 30
        static Scalewithupgrades = true
        static Isdebuff = true
        static RowID = 8
    }
    static Jesterultipoison = class {
        static Name = "JesterUltiPoison"
        static Durationticks = 120
        static Triggerrate = 20
        static Triggeronfirsttick = true
        static Refreshable = true
        static Damage = 290
        static Ultichargepercent = 100
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 9
    }
    static Fleapetdot = class {
        static Name = "FleaPetDot"
        static Durationticks = 80
        static Triggerrate = 20
        static Stacking = true
        static Damage = 200
        static Ultichargepercent = 100
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 10
    }
    static Fleapethot = class {
        static Name = "FleaPetHot"
        static Durationticks = 80
        static Triggerrate = 20
        static Stacking = true
        static Healing = 250
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static RowID = 11
    }
    static Fleaextrapetdot = class {
        static Name = "FleaExtraPetDot"
        static Durationticks = 40
        static Triggerrate = 20
        static Stacking = true
        static Damage = 200
        static Ultichargepercent = 100
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 12
    }
    static Samuraishield = class {
        static Name = "SamuraiShield"
        static Durationticks = 9999999
        static Cancelondamage = true
        static Refreshable = true
        static Shieldpercent = 60
        static RowID = 13
    }
    static Samuraihide = class {
        static Name = "SamuraiHide"
        static Durationticks = 120
        static Canceloncharge = true
        static Refreshable = true
        static Shieldpercent = 100
        static Speedreducepercent = 100
        static Cleanse = true
        static Doblinkclear = true
        static Ccimmunity = true
        static Attackimmunity = true
        static Invisibility = "full"
        static Loseplayercontrol = true
        static RowID = 14
    }
    static Snakeoildot = class {
        static Name = "SnakeOilDot"
        static Durationticks = 40
        static Triggerrate = 20
        static Triggeronfirsttick = true
        static Stacking = true
        static Damage = 380
        static Ultichargepercent = 68
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static Hapticstosource = true
        static RowID = 15
    }
    static Snakeoilhot = class {
        static Name = "SnakeOilHot"
        static Durationticks = 40
        static Triggerrate = 20
        static Triggeronfirsttick = true
        static Stacking = true
        static Healing = 380
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static RowID = 16
    }
    static Snakeoilgadgetdot = class {
        static Name = "SnakeOilGadgetDot"
        static Durationticks = 40
        static Triggerrate = 20
        static Triggeronfirsttick = true
        static Stacking = true
        static Damage = 304
        static Ultichargepercent = 82
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static Hapticstosource = true
        static RowID = 17
    }
    static Snakeoilgadgethot = class {
        static Name = "SnakeOilGadgetHot"
        static Durationticks = 40
        static Triggerrate = 20
        static Triggeronfirsttick = true
        static Stacking = true
        static Healing = 228
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static RowID = 18
    }
    static Crowpoison = class {
        static Name = "CrowPoison"
        static Durationticks = 80
        static Triggerrate = 20
        static Refreshable = true
        static Damage = 80
        static Ultichargepercent = 30
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 19
    }
    static Crowcripplesp = class {
        static Name = "CrowCrippleSP"
        static Durationticks = 80
        static Damagereducepercent = 15
        static Isdebuff = true
        static RowID = 20
    }
    static Luchadorfire = class {
        static Name = "LuchadorFire"
        static Durationticks = 80
        static Triggerrate = 20
        static Refreshable = true
        static Damage = 225
        static Ultichargepercent = 0
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 21
    }
    static Shadowmushroomhot = class {
        static Name = "ShadowMushroomHot"
        static Durationticks = 40
        static Triggerrate = 20
        static Triggeronfirsttick = true
        static Stacking = true
        static Healing = 235
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 22
    }
    static Shadowmushroomdot = class {
        static Name = "ShadowMushroomDot"
        static Durationticks = 40
        static Triggerrate = 20
        static Triggeronfirsttick = true
        static Stacking = true
        static Damage = 240
        static Ultichargepercent = 30
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static RowID = 23
    }
    static Attacherultidot = class {
        static Name = "AttacherUltiDot"
        static Durationticks = 40
        static Triggerrate = 20
        static Stacking = true
        static Damage = 125
        static Ultichargepercent = 30
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 24
    }
    static Cookergadgetdot = class {
        static Name = "CookerGadgetDot"
        static Durationticks = 60
        static Triggerrate = 20
        static Triggeronfirsttick = true
        static Refreshable = true
        static Damage = 130
        static Ultichargepercent = 30
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 25
    }
    static Cookergadgethot = class {
        static Name = "CookerGadgetHot"
        static Durationticks = 60
        static Triggerrate = 20
        static Triggeronfirsttick = true
        static Refreshable = true
        static Healing = 350
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static RowID = 26
    }
    static Ghostincorporeal = class {
        static Name = "GhostIncorporeal"
        static Durationticks = 120
        static Stacking = true
        static Refreshable = true
        static Speedboostpercent = 30
        static Movethroughwalls = true
        static Movethroughwater = true
        static Timerbar = true
        static RowID = 27
    }
    static Ghostshield = class {
        static Name = "GhostShield"
        static Durationticks = 120
        static Refreshable = true
        static Shieldpercent = 30
        static RowID = 28
    }
    static Ghostdeadcenterreward = class {
        static Name = "GhostDeadCenterReward"
        static Durationticks = 20
        static Stacking = true
        static Speedboostpercent = 15
        static RowID = 29
    }
    static Ghostspooked = class {
        static Name = "GhostSpooked"
        static Durationticks = 80
        static Refreshable = true
        static Speedreducepercent = 20
        static Isdebuff = true
        static RowID = 30
    }
    static Mosquitopoison = class {
        static Name = "MosquitoPoison"
        static Durationticks = 80
        static Triggerrate = 20
        static Stacking = true
        static Isdebuff = true
        static RowID = 31
    }
    static Demonicritualcooldown = class {
        static Name = "DemonicRitualCooldown"
        static Durationticks = 10
        static Triggerrate = 20
        static RowID = 32
    }
    static Angelicgracecooldown = class {
        static Name = "AngelicGraceCooldown"
        static Durationticks = 20
        static Triggerrate = 20
        static RowID = 33
    }
    static Demonicmomentum = class {
        static Name = "DemonicMomentum"
        static Durationticks = 9999999
        static Cancelonhealthregen = true
        static Triggerrate = 20
        static Refreshable = true
        static Speedboostabsolute = 40
        static RowID = 34
    }
    static Speedofanangel = class {
        static Name = "SpeedOfAnAngel"
        static Durationticks = 9999999
        static Triggerrate = 20
        static Stacking = true
        static Refreshable = true
        static Speedboostabsolute = 100
        static RowID = 35
    }
    static Speedofanangel002 = class {
        static Name = "SpeedOfAnAngel002"
        static Durationticks = 9999999
        static Triggerrate = 20
        static Stacking = true
        static Refreshable = true
        static Speedboostabsolute = 140
        static RowID = 36
    }
    static Lastbreathcooldown = class {
        static Name = "LastBreathCooldown"
        static Durationticks = 500
        static Triggerrate = 20
        static Persisttransformation = true
        static RowID = 37
    }
    static Lastbreath = class {
        static Name = "LastBreath"
        static Durationticks = 30
        static Triggerrate = 10
        static Shieldpercent = 100
        static Persisttransformation = true
        static RowID = 38
    }
    static Angelicwrathcooldown = class {
        static Name = "AngelicWrathCooldown"
        static Durationticks = 50
        static Triggerrate = 20
        static RowID = 39
    }
    static Demonicfirecooldown = class {
        static Name = "DemonicfireCooldown"
        static Durationticks = 10
        static Triggerrate = 10
        static RowID = 40
    }
    static Invokdemonicpetafterdying = class {
        static Name = "InvokDemonicPetAfterDying"
        static Durationticks = 9999999
        static Triggerrate = 20
        static Spawncharacterondeath = "DemonicPet"
        static RowID = 41
    }
    static Invokeangelicbigpetafterdying = class {
        static Name = "InvokeAngelicBigPetAfterDying"
        static Durationticks = 9999999
        static Triggerrate = 20
        static RowID = 42
    }
    static Voodoogadgetspeedup = class {
        static Name = "VoodooGadgetSpeedUp"
        static Durationticks = 60
        static Speedboostpercent = 40
        static RowID = 43
    }
    static Voodoogadgetshield = class {
        static Name = "VoodooGadgetShield"
        static Durationticks = 60
        static Shieldpercent = 30
        static RowID = 44
    }
    static Silencerultiovercharged = class {
        static Name = "SilencerUltiOvercharged"
        static Durationticks = 30
        static Loseplayercontrol = true
        static Fullstun = true
        static Isdebuff = true
        static RowID = 45
    }
    static Barrelbotshield = class {
        static Name = "BarrelbotShield"
        static Durationticks = 18
        static Shieldpercent = 50
        static RowID = 46
    }
    static Barrelbotafterchargeshield = class {
        static Name = "BarrelbotAfterChargeShield"
        static Durationticks = 40
        static Shieldpercent = 25
        static RowID = 47
    }
    static Demonicmomentum002 = class {
        static Name = "DemonicMomentum002"
        static Durationticks = 9999999
        static Cancelonhealthregen = true
        static Triggerrate = 20
        static Refreshable = true
        static Speedboostabsolute = 110
        static RowID = 48
    }
    static Demonicmomentum003 = class {
        static Name = "DemonicMomentum003"
        static Durationticks = 9999999
        static Cancelonhealthregen = true
        static Triggerrate = 20
        static Refreshable = true
        static Speedboostabsolute = 180
        static RowID = 49
    }
    static Demonicmomentum004 = class {
        static Name = "DemonicMomentum004"
        static Durationticks = 9999999
        static Cancelonhealthregen = true
        static Triggerrate = 20
        static Refreshable = true
        static Speedboostabsolute = 250
        static RowID = 50
    }
    static Demonicmomentumcooldown = class {
        static Name = "DemonicMomentumCooldown"
        static Durationticks = 15
        static RowID = 51
    }
    static Demonicrevengecooldown = class {
        static Name = "DemonicRevengeCooldown"
        static Durationticks = 30
        static Serveronly = true
        static RowID = 52
    }
    static Demonicsoulcollectorcooldown = class {
        static Name = "DemonicSoulCollectorCooldown"
        static Durationticks = 40
        static Serveronly = true
        static RowID = 53
    }
    static Speedofanangel003 = class {
        static Name = "SpeedOfAnAngel003"
        static Durationticks = 9999999
        static Triggerrate = 20
        static Stacking = true
        static Refreshable = true
        static Speedboostabsolute = 180
        static RowID = 54
    }
    static Speedofanangel004 = class {
        static Name = "SpeedOfAnAngel004"
        static Durationticks = 9999999
        static Triggerrate = 20
        static Stacking = true
        static Refreshable = true
        static Speedboostabsolute = 200
        static RowID = 55
    }
    static Speedofanangel005 = class {
        static Name = "SpeedOfAnAngel005"
        static Durationticks = 9999999
        static Triggerrate = 20
        static Stacking = true
        static Refreshable = true
        static Speedboostabsolute = 220
        static RowID = 56
    }
    static Lightyearfire = class {
        static Name = "LightyearFire"
        static Durationticks = 80
        static Triggerrate = 20
        static Refreshable = true
        static Damage = 80
        static Ultichargepercent = 30
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 57
    }
    static Skaterultitaunt = class {
        static Name = "SkaterUltiTaunt"
        static Durationticks = 50
        static Cancelonsourcedeath = true
        static Triggeronfirsttick = true
        static Refreshable = true
        static Damage = 800
        static Ultichargepercent = 100
        static Taunt = true
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 58
    }
    static Skaterultihctaunt = class {
        static Name = "SkaterUltiHCTaunt"
        static Durationticks = 50
        static Cancelonsourcedeath = true
        static Triggeronfirsttick = true
        static Refreshable = true
        static Damage = 1000
        static Ultichargepercent = 100
        static Taunt = true
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 59
    }
    static Skaterultiammoreductionself = class {
        static Name = "SkaterUltiAmmoReductionSelf"
        static Durationticks = 30
        static Triggeronfirsttick = true
        static Ammoreducepercent = 50
        static Isdebuff = true
        static RowID = 60
    }
    static Skatergadgetjumptaunt = class {
        static Name = "SkaterGadgetJumpTaunt"
        static Durationticks = 20
        static Cancelonsourcedeath = true
        static Triggeronfirsttick = true
        static Refreshable = true
        static Taunt = true
        static Isdebuff = true
        static RowID = 61
    }
    static Skatergadgetprojectiletaunt = class {
        static Name = "SkaterGadgetProjectileTaunt"
        static Durationticks = 20
        static Cancelonsourcedeath = true
        static Triggeronfirsttick = true
        static Refreshable = true
        static Taunt = true
        static Isdebuff = true
        static RowID = 62
    }
    static Meeplesuperarea = class {
        static Name = "MeepleSuperArea"
        static Durationticks = 10
        static Refreshable = true
        static Attackpiercecharacters = true
        static Attackthroughwalls = true
        static Ultiattackthroughwalls = true
        static RowID = 63
    }
    static Invulnerable = class {
        static Name = "Invulnerable"
        static Durationticks = 9999999
        static Triggerrate = 10
        static Shieldpercent = 100
        static RowID = 64
    }
    static Arenabuff = class {
        static Name = "ArenaBuff"
        static Durationticks = 1300
        static Triggerrate = 20
        static Shieldpercent = 30
        static Speedboostabsolute = 80
        static Persisttransformation = true
        static RowID = 65
    }
    static Morningstarsuperroot = class {
        static Name = "MorningstarSuperRoot"
        static Durationticks = 20
        static Refreshable = true
        static Speedreducepercent = 100
        static Isdebuff = true
        static RowID = 66
    }
    static Morningstarrecallslow = class {
        static Name = "MorningstarRecallSlow"
        static Durationticks = 20
        static Refreshable = true
        static Speedreducepercent = 30
        static Isdebuff = true
        static RowID = 67
    }
    static Gusoverchargedhealingprojectile = class {
        static Name = "GusOverchargedHealingProjectile"
        static Durationticks = 10
        static Triggerrate = 20
        static Triggeronfirsttick = true
        static Stacking = true
        static Healing = 340
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static RowID = 68
    }
    static Chronomancertimebendspeedreduce = class {
        static Name = "ChronomancerTimebendSpeedReduce"
        static Durationticks = 2
        static Triggeronfirsttick = true
        static Refreshable = true
        static Speedreducepercent = 70
        static Isdebuff = true
        static RowID = 69
    }
    static Chronomancertimebendspeedboost = class {
        static Name = "ChronomancerTimebendSpeedBoost"
        static Durationticks = 100
        static Triggeronfirsttick = true
        static Refreshable = true
        static Speedboostpercent = 30
        static RowID = 70
    }
    static Chronomancertimebendboostself = class {
        static Name = "ChronomancerTimebendBoostSelf"
        static Durationticks = 100
        static Triggeronfirsttick = true
        static Refreshable = true
        static Speedboostpercent = 30
        static Damageboostpercent = 25
        static RowID = 71
    }
    static Chronomancergadgetprojectilestasis = class {
        static Name = "ChronomancerGadgetProjectileStasis"
        static Durationticks = 40
        static Triggeronfirsttick = true
        static Refreshable = true
        static Stasis = true
        static Isdebuff = true
        static RowID = 72
    }
    static Cleanseinfinitenovfx = class {
        static Name = "CleanseInfiniteNoVFX"
        static Durationticks = 9999999
        static Refreshable = true
        static Cleanse = true
        static RowID = 73
    }
    static Alternatorprojectileheal = class {
        static Name = "AlternatorProjectileHeal"
        static Durationticks = 2
        static Triggeronfirsttick = true
        static Healing = 650
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Hapticstosource = true
        static RowID = 74
    }
    static Alternatorhealaura = class {
        static Name = "AlternatorHealAura"
        static Durationticks = 2
        static Triggeronfirsttick = true
        static Healing = 750
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Hapticstosource = true
        static RowID = 75
    }
    static Alternatorspeedaura = class {
        static Name = "AlternatorSpeedAura"
        static Durationticks = 40
        static Refreshable = true
        static Speedboostpercent = 30
        static Scalewithbuffs = true
        static RowID = 76
    }
    static Alternatordamageaura = class {
        static Name = "AlternatorDamageAura"
        static Durationticks = 2
        static Triggeronfirsttick = true
        static Damage = 650
        static Ultichargepercent = 100
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Hapticstosource = true
        static RowID = 77
    }
    static Alternatorslowaura = class {
        static Name = "AlternatorSlowAura"
        static Durationticks = 40
        static Refreshable = true
        static Speedreducepercent = 30
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 78
    }
    static Alternatorprojectilespeedtrail = class {
        static Name = "AlternatorProjectileSpeedTrail"
        static Durationticks = 15
        static Refreshable = true
        static Speedboostpercent = 20
        static RowID = 79
    }
    static Alternatorprojectileslowtrail = class {
        static Name = "AlternatorProjectileSlowTrail"
        static Durationticks = 15
        static Refreshable = true
        static Speedreducepercent = 20
        static Isdebuff = true
        static RowID = 80
    }
    static Alternatorhealauraovercharged = class {
        static Name = "AlternatorHealAuraOvercharged"
        static Durationticks = 2
        static Triggeronfirsttick = true
        static Healing = 1000
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Hapticstosource = true
        static RowID = 81
    }
    static Alternatorspeedauraovercharged = class {
        static Name = "AlternatorSpeedAuraOvercharged"
        static Durationticks = 40
        static Refreshable = true
        static Speedboostpercent = 40
        static Scalewithbuffs = true
        static RowID = 82
    }
    static Geishastormdebuff = class {
        static Name = "GeishaStormDebuff"
        static Durationticks = 2
        static Refreshable = true
        static Booleanattributes = "HasStormVision"
        static RowID = 83
    }
    static Geishatransformedultidamagemark = class {
        static Name = "GeishaTransformedUltiDamageMark"
        static Durationticks = 50
        static Triggerrate = 50
        static Stacking = true
        static Damage = 1500
        static Ultichargepercent = 100
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static Persisttransformation = true
        static Hapticstosource = true
        static RowID = 84
    }
    static Geishatransformedultidamagemarksp = class {
        static Name = "GeishaTransformedUltiDamageMarkSp"
        static Durationticks = 50
        static Triggerrate = 50
        static Stacking = true
        static Damage = 1500
        static Ultichargepercent = 100
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static Spawnareaeffectondeath = "GeishaTransformedMarkExplosionSP"
        static Persisttransformation = true
        static Hapticstosource = true
        static RowID = 85
    }
    static Geishatransformedultidamagemarkovercharged = class {
        static Name = "GeishaTransformedUltiDamageMarkOvercharged"
        static Durationticks = 50
        static Triggerrate = 50
        static Stacking = true
        static Damage = 1500
        static Ultichargepercent = 100
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static Spawnareaeffectondeath = "GeishaTransformedMarkDamagedOvercharged"
        static Persisttransformation = true
        static Booleanattributes = "InstantTriggerIfKills"
        static Hapticstosource = true
        static RowID = 86
    }
    static Geishatransformedultidamagemarkspovercharged = class {
        static Name = "GeishaTransformedUltiDamageMarkSpOvercharged"
        static Durationticks = 50
        static Triggerrate = 50
        static Stacking = true
        static Damage = 1500
        static Ultichargepercent = 100
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static Spawnareaeffectondeath = "GeishaTransformedMarkExplosionSPOvercharged"
        static Persisttransformation = true
        static Booleanattributes = "InstantTriggerIfKills"
        static Hapticstosource = true
        static RowID = 87
    }
    static Geishatransformspeedboost = class {
        static Name = "GeishaTransformSpeedBoost"
        static Durationticks = 50
        static Refreshable = true
        static Speedboostpercent = 30
        static RowID = 88
    }
    static Geishatransforminvisibility = class {
        static Name = "GeishaTransformInvisibility"
        static Durationticks = 40
        static Cancelondamage = true
        static Refreshable = true
        static Invisibility = "normal"
        static Booleanattributes = "CancelOnAttack"
        static RowID = 89
    }
    static Geishaweakspotslowdown = class {
        static Name = "GeishaWeakSpotSlowdown"
        static Durationticks = 50
        static Refreshable = true
        static Speedreducepercent = 30
        static Isdebuff = true
        static RowID = 90
    }
    static Skatermutanttaunt = class {
        static Name = "SkaterMutantTaunt"
        static Durationticks = 60
        static Cancelonsourcedeath = true
        static Triggeronfirsttick = true
        static Refreshable = true
        static Taunt = true
        static Isdebuff = true
        static RowID = 91
    }
    static Triggerprojectileonhittingcooldown = class {
        static Name = "TriggerProjectileOnHittingCooldown"
        static Durationticks = 10
        static RowID = 92
    }
    static Megabossvulnerablegen = class {
        static Name = "MegaBossVulnerableGen"
        static Durationticks = 9999999
        static Damagereceivedboostpercent = 100
        static RowID = 93
    }
    static Forceshow = class {
        static Name = "ForceShow"
        static Durationticks = 10
        static Forceshow = true
        static RowID = 94
    }
    static Mutantrosaforceshow = class {
        static Name = "MutantRosaForceShow"
        static Durationticks = 999999
        static Forceshow = true
        static RowID = 95
    }
    static Mutantghostincorporeal = class {
        static Name = "MutantGhostIncorporeal"
        static Durationticks = 20
        static Stacking = true
        static Refreshable = true
        static Speedboostpercent = 30
        static Movethroughwalls = true
        static Movethroughwater = true
        static Timerbar = true
        static RowID = 96
    }
    static Safeinvulnerability = class {
        static Name = "SafeInvulnerability"
        static Durationticks = 60
        static Triggeronfirsttick = true
        static Shieldpercent = 100
        static Timerbar = true
        static RowID = 97
    }
    static Debug = class {
        static Name = "Debug"
        static Durationticks = 20
        static Refreshable = true
        static Speedreducepercent = 100
        static Isdebuff = true
        static RowID = 98
    }
    static Gusoverchargeddmgprojectile = class {
        static Name = "GusOverchargedDmgProjectile"
        static Durationticks = 10
        static Triggerrate = 20
        static Triggeronfirsttick = true
        static Stacking = true
        static Damage = 900
        static Ultichargepercent = 20
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 99
    }
    static Speedwhenusingultiangels = class {
        static Name = "SpeedWhenUsingUltiAngels"
        static Durationticks = 60
        static Triggerrate = 20
        static Stacking = true
        static Refreshable = true
        static Speedboostpercent = 20
        static RowID = 100
    }
    static Speedboostonkilldemons = class {
        static Name = "SpeedBoostOnKillDemons"
        static Durationticks = 60
        static Triggerrate = 10
        static Refreshable = true
        static Speedboostpercent = 20
        static RowID = 101
    }
    static Shootprojectileonbasicattackcooldown = class {
        static Name = "ShootProjectileOnBasicAttackCooldown"
        static Durationticks = 10
        static RowID = 102
    }
    static Demonicstatuseffectforprojectiles = class {
        static Name = "DemonicStatusEffectForProjectiles"
        static Durationticks = 80
        static Triggerrate = 20
        static Refreshable = true
        static Damage = 100
        static Ultichargepercent = 0
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 103
    }
    static Cannongirloverchargedstun = class {
        static Name = "CannonGirlOverchargedStun"
        static Durationticks = 20
        static Refreshable = true
        static Loseplayercontrol = true
        static Fullstun = true
        static Isdebuff = true
        static RowID = 104
    }
    static Domainonareabuff = class {
        static Name = "DomainOnAreaBuff"
        static Durationticks = 2
        static Refreshable = true
        static Speedboostpercent = 20
        static Damageboostpercent = 30
        static RowID = 105
    }
    static Domaindamagereducesp = class {
        static Name = "DomainDamageReduceSP"
        static Durationticks = 2
        static Refreshable = true
        static Damagereducepercent = 15
        static Isdebuff = true
        static RowID = 106
    }
    static Domainforceshowsp = class {
        static Name = "DomainForceShowSP"
        static Durationticks = 2
        static Refreshable = true
        static Forceshow = true
        static Isdebuff = true
        static Serveronly = true
        static RowID = 107
    }
    static Domaininversedamagegadget = class {
        static Name = "DomainInverseDamageGadget"
        static Durationticks = 40
        static Cancelondamage = true
        static Booleanattributes = "ReceiveDamageInversion"
        static RowID = 108
    }
    static Domainoverchargedultidamage = class {
        static Name = "DomainOverchargedUltiDamage"
        static Durationticks = 20
        static Triggerrate = 1
        static Refreshable = true
        static Damage = 150
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static Hapticstosource = true
        static RowID = 109
    }
    static Angelichot = class {
        static Name = "AngelicHot"
        static Durationticks = 40
        static Triggerrate = 20
        static Triggeronfirsttick = true
        static Stacking = true
        static Healing = 250
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static RowID = 110
    }
    static Icedudehypothermia = class {
        static Name = "IceDudeHypothermia"
        static Durationticks = 750
        static Refreshable = true
        static Damagereducepercent = 50
        static Isdebuff = true
        static Serveronly = true
        static Booleanattributes = "PartialStunBasedDamageReduce"
        static RowID = 111
    }
    static Duplicatorpettooclosecripple = class {
        static Name = "DuplicatorPetTooCloseCripple"
        static Durationticks = 2
        static Refreshable = true
        static Damagereducepercent = 50
        static Isdebuff = true
        static RowID = 112
    }
    static Stalkerultiinvisible = class {
        static Name = "StalkerUltiInvisible"
        static Durationticks = 140
        static Refreshable = true
        static Pulsatingactivetickson = 40
        static Pulsatingactiveticksoff = 10
        static Invisibility = "attacks_dont_reveal"
        static Timerbar = true
        static RowID = 113
    }
    static Stalkerultidamagetargetcurrenthpboost = class {
        static Name = "StalkerUltiDamageTargetCurrentHpBoost"
        static Durationticks = 999999
        static Cancelonchargeend = true
        static Refreshable = true
        static Damageboosttargetcurrenthealthpercent = 25
        static RowID = 114
    }
    static Electrosnipercurse = class {
        static Name = "ElectroSniperCurse"
        static Durationticks = 99999
        static Stacking = true
        static Refreshable = true
        static Damagereceivedboostpercent = 35
        static Isdebuff = true
        static Booleanattributes = "RemoveOtherInstances"
        static RowID = 115
    }
    static Dragonraidermark = class {
        static Name = "DragonRaiderMark"
        static Durationticks = 100
        static Stacking = true
        static Refreshable = true
        static Damagereceivedboostpercent = 35
        static Isdebuff = true
        static RowID = 116
    }
    static Splittertag = class {
        static Name = "SplitterTag"
        static Durationticks = 100
        static Cancelondamage = true
        static Stacking = true
        static Damagereceivedboostabsolute = 700
        static Scalewithupgrades = true
        static Isdebuff = true
        static Booleanattributes = "NotForObjects"
        static RowID = 117
    }
    static Bullgadgetstun = class {
        static Name = "BullGadgetStun"
        static Durationticks = 10
        static Stacking = true
        static Refreshable = true
        static Loseplayercontrol = true
        static Fullstun = true
        static RowID = 118
    }
    static Dodgeballdeathstun = class {
        static Name = "DodgeballDeathStun"
        static Durationticks = 60
        static Shieldpercent = 100
        static Loseplayercontrol = true
        static Fullstun = true
        static Isdebuff = true
        static Booleanattributes = "IgnoreCCImmunity"
        static RowID = 119
    }
    static Ssjetpackslow = class {
        static Name = "SS_JetpackSlow"
        static Durationticks = 40
        static Refreshable = true
        static Speedreducepercent = 30
        static Isdebuff = true
        static RowID = 120
    }
    static Trailrunspeedboostonkill = class {
        static Name = "TrailRunSpeedBoostOnKill"
        static Durationticks = 60
        static Gradualwearoffafter = 20
        static Stacking = true
        static Speedboostabsolute = 800
        static RowID = 121
    }
    static Trailrunrubberbandspeedboost1 = class {
        static Name = "TrailRunRubberBandSpeedBoost1"
        static Durationticks = 60
        static Gradualwearoffafter = 20
        static Stacking = true
        static Speedboostabsolute = 200
        static RowID = 122
    }
    static Trailrunrubberbandspeedboost2 = class {
        static Name = "TrailRunRubberBandSpeedBoost2"
        static Durationticks = 70
        static Gradualwearoffafter = 30
        static Stacking = true
        static Speedboostabsolute = 300
        static RowID = 123
    }
    static Trailrunrubberbandspeedboost3 = class {
        static Name = "TrailRunRubberBandSpeedBoost3"
        static Durationticks = 80
        static Gradualwearoffafter = 40
        static Stacking = true
        static Speedboostabsolute = 400
        static RowID = 124
    }
    static Furyslowdown = class {
        static Name = "FurySlowdown"
        static Durationticks = 20
        static Refreshable = true
        static Speedreducepercent = 20
        static Isdebuff = true
        static RowID = 125
    }
    static Stickybombultislow = class {
        static Name = "StickyBombUltiSlow"
        static Durationticks = 80
        static Refreshable = true
        static Speedreduceabsolute = 350
        static Isdebuff = true
        static RowID = 126
    }
    static Maisieultislow = class {
        static Name = "MaisieUltiSlow"
        static Durationticks = 40
        static Refreshable = true
        static Speedreduceabsolute = 350
        static Isdebuff = true
        static RowID = 127
    }
    static Signalstrikereload = class {
        static Name = "SignalStrikeReload"
        static Durationticks = 30
        static Triggeronfirsttick = true
        static Ammoreducepercent = -33
        static Isdebuff = true
        static RowID = 128
    }
    static Megacrowpoison = class {
        static Name = "MegaCrowPoison"
        static Durationticks = 60
        static Triggerrate = 15
        static Refreshable = true
        static Damage = 50
        static Ultichargepercent = 30
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 129
    }
    static Megacrowpoisonstrong = class {
        static Name = "MegaCrowPoisonStrong"
        static Durationticks = 144
        static Triggerrate = 12
        static Refreshable = true
        static Damage = 120
        static Ultichargepercent = 30
        static Scalewithupgrades = true
        static Scalewithbuffs = true
        static Isdebuff = true
        static RowID = 130
    }
    static Dancerrootsp = class {
        static Name = "DancerRootSp"
        static Durationticks = 30
        static Refreshable = true
        static Speedreducepercent = 100
        static Isdebuff = true
        static RowID = 131
    }
    static Meepleoverchargedpasswall = class {
        static Name = "MeepleOverchargedPassWall"
        static Durationticks = 10
        static Refreshable = true
        static Movethroughwalls = true
        static Movethroughwater = true
        static RowID = 132
    }
    static Megabosssplittertag = class {
        static Name = "MegaBossSplitterTag"
        static Durationticks = 75
        static Cancelondamage = true
        static Stacking = true
        static Damagereceivedboostabsolute = 300
        static Scalewithupgrades = true
        static Isdebuff = true
        static Booleanattributes = "NotForObjects"
        static RowID = 133
    }
    static Trailrunrubberbandspeedboost4 = class {
        static Name = "TrailRunRubberBandSpeedBoost4"
        static Durationticks = 90
        static Gradualwearoffafter = 50
        static Stacking = true
        static Speedboostabsolute = 500
        static RowID = 134
    }
    static Trailrunrubberbandspeedboost5 = class {
        static Name = "TrailRunRubberBandSpeedBoost5"
        static Durationticks = 100
        static Gradualwearoffafter = 60
        static Stacking = true
        static Speedboostabsolute = 600
        static RowID = 135
    }
    static Trailrunrubberbandspeedboost6 = class {
        static Name = "TrailRunRubberBandSpeedBoost6"
        static Durationticks = 110
        static Gradualwearoffafter = 70
        static Stacking = true
        static Speedboostabsolute = 700
        static RowID = 136
    }
    static Trailrunrubberbandspeedboost7 = class {
        static Name = "TrailRunRubberBandSpeedBoost7"
        static Durationticks = 120
        static Gradualwearoffafter = 80
        static Stacking = true
        static Speedboostabsolute = 800
        static RowID = 137
    }
}

export default Statuseffectslogic;