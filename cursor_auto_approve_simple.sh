#!/bin/bash
# Simple shell script version using AppleScript
# This version continuously monitors and sends Enter key when Cursor is active

echo "Cursor Auto-Approve Agent (Simple) started"
echo "Press Ctrl+C to stop"
echo ""

while true; do
    # Check if Cursor is running and is the frontmost app
    osascript -e '
    tell application "System Events"
        if (name of processes) contains "Cursor" then
            set frontApp to name of first application process whose frontmost is true
            if frontApp contains "ursor" then
                keystroke return
            end if
        end if
    end tell
    ' 2>/dev/null
    
    sleep 0.5  # Check every 500ms
done

