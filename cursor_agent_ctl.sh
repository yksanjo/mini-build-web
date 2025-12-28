#!/bin/bash
# Cursor Agent Control Script
# Manages the Cursor auto-approve agent (start, stop, status, restart)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENT_SCRIPT="$SCRIPT_DIR/cursor_auto_approve_smart.py"
PID_FILE="$HOME/.cursor_agent.pid"
LOG_FILE="$HOME/.cursor_agent.log"

function is_running() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE" 2>/dev/null)
        if [ -n "$PID" ] && ps -p "$PID" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

function start_agent() {
    if is_running; then
        echo "Agent is already running (PID: $(cat "$PID_FILE"))"
        return 1
    fi
    
    echo "Starting Cursor Auto-Approve Agent..."
    
    # Check if pynput is installed
    python3 -c "import pynput" 2>/dev/null
    if [ $? -ne 0 ]; then
        echo "Installing dependencies..."
        pip3 install -r "$SCRIPT_DIR/requirements.txt" > /dev/null 2>&1
    fi
    
    # Start in background
    nohup python3 "$AGENT_SCRIPT" --background > /dev/null 2>&1 &
    
    sleep 1
    
    if is_running; then
        echo "✓ Agent started successfully (PID: $(cat "$PID_FILE"))"
        echo "  Log file: $LOG_FILE"
        return 0
    else
        echo "✗ Failed to start agent"
        return 1
    fi
}

function stop_agent() {
    if ! is_running; then
        echo "Agent is not running"
        return 1
    fi
    
    PID=$(cat "$PID_FILE")
    echo "Stopping agent (PID: $PID)..."
    
    kill "$PID" 2>/dev/null
    
    # Wait for process to stop
    for i in {1..10}; do
        if ! ps -p "$PID" > /dev/null 2>&1; then
            rm -f "$PID_FILE"
            echo "✓ Agent stopped"
            return 0
        fi
        sleep 0.5
    done
    
    # Force kill if still running
    if ps -p "$PID" > /dev/null 2>&1; then
        kill -9 "$PID" 2>/dev/null
        rm -f "$PID_FILE"
        echo "✓ Agent force stopped"
    fi
    
    return 0
}

function status_agent() {
    if is_running; then
        PID=$(cat "$PID_FILE")
        echo "✓ Agent is running (PID: $PID)"
        
        # Show recent log entries
        if [ -f "$LOG_FILE" ]; then
            echo ""
            echo "Recent activity:"
            tail -n 5 "$LOG_FILE" | sed 's/^/  /'
        fi
        
        # Show approval count
        if [ -f "$LOG_FILE" ]; then
            APPROVALS=$(grep -c "Auto-approved edit" "$LOG_FILE" 2>/dev/null || echo "0")
            echo ""
            echo "Total approvals: $APPROVALS"
        fi
        
        return 0
    else
        echo "✗ Agent is not running"
        return 1
    fi
}

function restart_agent() {
    stop_agent
    sleep 1
    start_agent
}

function show_logs() {
    if [ -f "$LOG_FILE" ]; then
        if [ -n "$1" ]; then
            tail -n "$1" "$LOG_FILE"
        else
            tail -f "$LOG_FILE"
        fi
    else
        echo "Log file not found: $LOG_FILE"
        return 1
    fi
}

case "$1" in
    start)
        start_agent
        ;;
    stop)
        stop_agent
        ;;
    restart)
        restart_agent
        ;;
    status)
        status_agent
        ;;
    logs)
        show_logs "$2"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs [n]}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the agent in background"
        echo "  stop    - Stop the running agent"
        echo "  restart - Restart the agent"
        echo "  status  - Show agent status and recent activity"
        echo "  logs    - Show log file (use 'logs 50' for last 50 lines, or 'logs' for tail -f)"
        exit 1
        ;;
esac

