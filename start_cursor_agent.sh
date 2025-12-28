#!/bin/bash
# Quick start script for Cursor Auto-Approve Agent

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if control script exists and use it
if [ -f "$SCRIPT_DIR/cursor_agent_ctl.sh" ]; then
    echo "Using control script to start agent..."
    "$SCRIPT_DIR/cursor_agent_ctl.sh" start
    echo ""
    echo "Use './cursor_agent_ctl.sh status' to check status"
    echo "Use './cursor_agent_ctl.sh logs' to view logs"
    echo "Use './cursor_agent_ctl.sh stop' to stop"
else
    # Fallback to direct start
    echo "Starting Cursor Auto-Approve Agent..."
    echo ""
    
    # Check if pynput is installed
    python3 -c "import pynput" 2>/dev/null
    if [ $? -ne 0 ]; then
        echo "Installing dependencies..."
        pip3 install -r "$SCRIPT_DIR/requirements.txt"
    fi
    
    # Start the smart version
    echo "Launching agent (Smart Version)..."
    echo "Press Ctrl+C to stop"
    echo ""
    python3 "$SCRIPT_DIR/cursor_auto_approve_smart.py"
fi

