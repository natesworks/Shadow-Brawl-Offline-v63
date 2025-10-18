class Tutorial {
    static Loot1 = class {
        static Name = "loot_1"
        static Startdelayms = 7000
        static Startcondition = "none"
        static Completecondition = "loot"
        static Speechbubblecharacterswf = "sc/ui.sc"
        static Speechbubblecharactermovieclip = "tutorial_character_top"
        static Speechbubbletids = "TID_TUTORIAL_1"
        static Startsound = "Tut_speech"
        static Customdata = 0
        static RowID = 1
    }
    static Loot2 = class {
        static Name = "loot_2"
        static Disabled = true
        static Startdelayms = 0
        static Startcondition = "none"
        static Completecondition = "loot"
        static Speechbubblecharacterswf = "sc/ui.sc"
        static Speechbubblecharactermovieclip = "tutorial_character_top"
        static Speechbubbletids = "TID_TUTORIAL_2"
        static Startsound = "Tut_speech"
        static Customdata = 0
        static RowID = 2
    }
    static Gg1 = class {
        static Name = "gg1"
        static Startdelayms = 500
        static Enddelayms = 1500
        static Startcondition = "none"
        static Completecondition = "none"
        static Speechbubblecharacterswf = "sc/ui.sc"
        static Speechbubblecharactermovieclip = "tutorial_character_top"
        static Speechbubbletids = "TID_TUTORIAL_GOOD_JOB_1"
        static Startsound = "Tutorial_circle"
        static RowID = 3
    }
    static Pve1d1 = class {
        static Name = "pve1d1"
        static Disabled = true
        static Startdelayms = 500
        static Startcondition = "none"
        static Completecondition = "none"
        static Startsound = "Pve_wave_01"
        static Spawncharacter = "TutorialDummy"
        static Spawnlocationx = 1400
        static Spawnlocationy = 3200
        static Customdata = 1
        static RowID = 4
    }
    static Pve1d2 = class {
        static Name = "pve1d2"
        static Disabled = true
        static Startdelayms = 300
        static Startcondition = "none"
        static Completecondition = "none"
        static Spawncharacter = "TutorialDummy"
        static Spawnlocationx = 2200
        static Spawnlocationy = 3200
        static Customdata = 1
        static RowID = 5
    }
    static Pve1d3 = class {
        static Name = "pve1d3"
        static Disabled = true
        static Startdelayms = 300
        static Startcondition = "none"
        static Completecondition = "none"
        static Spawncharacter = "TutorialDummy"
        static Spawnlocationx = 3000
        static Spawnlocationy = 3200
        static Customdata = 1
        static RowID = 6
    }
    static Pve1d4 = class {
        static Name = "pve1d4"
        static Disabled = true
        static Startdelayms = 300
        static Startcondition = "none"
        static Completecondition = "none"
        static Spawncharacter = "TutorialDummy"
        static Spawnlocationx = 3800
        static Spawnlocationy = 3200
        static Customdata = 1
        static RowID = 7
    }
    static Manualshoot = class {
        static Name = "manual_shoot"
        static Disabled = true
        static Startdelayms = 1000
        static Startcondition = "none"
        static Completecondition = "kill_everything"
        static Speechbubblecharacterswf = "sc/ui.sc"
        static Speechbubblecharactermovieclip = "tutorial_character_top"
        static Speechbubbletids = "TID_TUTORIAL_3"
        static Startsound = "Tut_speech"
        static Showshootstick = true
        static RowID = 8
    }
    static Gg2 = class {
        static Name = "gg2"
        static Disabled = true
        static Startdelayms = 500
        static Enddelayms = 6000
        static Startcondition = "none"
        static Completecondition = "none"
        static Speechbubblecharacterswf = "sc/ui.sc"
        static Speechbubblecharactermovieclip = "tutorial_character_top"
        static Speechbubbletids = "TID_TUTORIAL_GOOD_JOB_2"
        static Startsound = "Tutorial_circle"
        static RowID = 9
    }
    static Pve2d1 = class {
        static Name = "pve2d1"
        static Startdelayms = 0
        static Startcondition = "none"
        static Completecondition = "none"
        static Startsound = "Pve_wave_01"
        static Spawncharacter = "TutorialDummy2"
        static Spawnlocationx = 1400
        static Spawnlocationy = 4500
        static Customdata = 1
        static RowID = 10
    }
    static Pve2d2 = class {
        static Name = "pve2d2"
        static Startdelayms = 500
        static Startcondition = "none"
        static Completecondition = "none"
        static Spawncharacter = "TutorialDummy2"
        static Spawnlocationx = 1900
        static Spawnlocationy = 3100
        static Customdata = 1
        static RowID = 11
    }
    static Pve2d3 = class {
        static Name = "pve2d3"
        static Startdelayms = 200
        static Startcondition = "none"
        static Completecondition = "none"
        static Spawncharacter = "TutorialDummy2"
        static Spawnlocationx = 3000
        static Spawnlocationy = 2900
        static Customdata = 1
        static RowID = 12
    }
    static Pve2d4 = class {
        static Name = "pve2d4"
        static Startdelayms = 100
        static Startcondition = "none"
        static Completecondition = "none"
        static Spawncharacter = "TutorialDummy2"
        static Spawnlocationx = 3800
        static Spawnlocationy = 4000
        static Customdata = 1
        static RowID = 13
    }
    static Autoshoot = class {
        static Name = "auto_shoot"
        static Startdelayms = 1000
        static Startcondition = "none"
        static Completecondition = "kill_everything"
        static Shoulduseautoshoot = true
        static Speechbubblecharacterswf = "sc/ui.sc"
        static Speechbubblecharactermovieclip = "tutorial_character_top"
        static Speechbubbletids = "TID_TUTORIAL_5"
        static Startsound = "Tut_speech"
        static Showulti = true
        static Showshootstick = true
        static RowID = 14
    }
    static Gg3 = class {
        static Name = "gg3"
        static Startdelayms = 0
        static Enddelayms = 1500
        static Startcondition = "none"
        static Completecondition = "none"
        static Speechbubblecharacterswf = "sc/ui.sc"
        static Speechbubblecharactermovieclip = "tutorial_character_top"
        static Speechbubbletids = "TID_TUTORIAL_GOOD_JOB_3"
        static Startsound = "Tutorial_circle"
        static RowID = 15
    }
    static Pve3d1 = class {
        static Name = "pve3d1"
        static Startdelayms = 0
        static Startcondition = "none"
        static Completecondition = "none"
        static Startsound = "Pve_wave_01"
        static Spawncharacter = "TutorialDummy3"
        static Spawnlocationx = 2600
        static Spawnlocationy = 1600
        static Customdata = 1
        static RowID = 16
    }
    static Useulti = class {
        static Name = "use_ulti"
        static Startdelayms = 1000
        static Startcondition = "none"
        static Completecondition = "use_ulti"
        static Useultix = 2600
        static Useultiy = 1200
        static Speechbubblecharacterswf = "sc/ui.sc"
        static Speechbubblecharactermovieclip = "tutorial_character_top"
        static Speechbubbletids = "TID_TUTORIAL_6"
        static Startsound = "Tut_speech"
        static Showulti = true
        static RowID = 17
    }
    static Clicktoend = class {
        static Name = "click_to_end"
        static Startdelayms = 1500
        static Forcespeechbubbleclosems = 2000
        static Startcondition = "none"
        static Completecondition = "none"
        static Speechbubblecharacterswf = "sc/ui.sc"
        static Speechbubblecharactermovieclip = "tutorial_character_top"
        static Speechbubbletids = "TID_TUTORIAL_9"
        static Startsound = "Tutorial_circle"
        static Blockingspeechbubble = true
        static RowID = 18
    }
}

export default Tutorial;