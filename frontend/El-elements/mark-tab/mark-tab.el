@div#container-mark
    @div#space
    @div#space
    @div#the-cont
        @div#header.place-cont
            @div.first
                @div#name-place.first &nameCont
                    @span#name-txt.fader *innerHTML=1 &name
                    @span.fader &colonSpan
                        %:
                    @input#name-inp.second placeholder="Enter.." &inp
            @div.second
                @button#del-mark &delGroup
                    @svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
                        @path fill="var(--white-1)" d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"
        @div#mark-alone.place-cont
            @div.first
                @span.fader
                    %Mark: 
            @div.second
                @input#name-inp.second-alpha placeholder="Enter.." &inp2
                @div#name-place.second &nameCont2
                    @span#val-txt &name2
                        %70
        @div#effort-alone.place-cont
            @div.first
                @span.fader
                    %effort: 
            @div.second
                @button-lt#lt-btn type="range" min="1" max="10" &inp3