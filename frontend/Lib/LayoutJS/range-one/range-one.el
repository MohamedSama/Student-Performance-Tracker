@div#container
    @div#left-shift.shift $click=1
        %<
    @div#value-cont
        @div#display &display
            %1
        @div#enter.hide
            @input#input type=number placeholder=depth &inp
    @div#right-shift.shift $click=2
        %>
    