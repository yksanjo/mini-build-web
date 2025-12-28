-- Cursor AI Edit Auto-Approval Agent (AppleScript version)
-- This script automatically presses Enter when Cursor's AI asks for edit approval

on run
    display notification "Cursor Auto-Approve Agent started" with title "Cursor Agent"
    
    repeat
        try
            tell application "System Events"
                -- Check if Cursor is running
                if (name of processes) contains "Cursor" then
                    set frontApp to name of first application process whose frontmost is true
                    
                    -- If Cursor is active, send Enter key
                    if frontApp contains "ursor" then
                        -- Send Enter key to approve
                        keystroke return
                        delay 0.1
                    end if
                end if
            end tell
            
            delay 0.5 -- Check every 500ms
        on error errMsg
            -- Continue on error
            delay 0.5
        end try
    end repeat
end run

