#!/usr/bin/env python3
"""
Cursor AI Edit Auto-Approval Agent

This script automatically presses Enter/Return when Cursor's AI asks for edit approval.
It monitors for Cursor's edit approval dialogs and auto-approves them.

Usage:
    python3 cursor_auto_approve.py

Requirements:
    pip install pynput
"""

import time
import sys
from pynput import keyboard
from pynput.keyboard import Key, Listener
import subprocess
import os

class CursorAutoApprove:
    def __init__(self):
        self.is_cursor_active = False
        self.approval_key = Key.enter  # Use Enter key
        self.check_interval = 0.5  # Check every 500ms
        
    def is_cursor_running(self):
        """Check if Cursor application is running"""
        try:
            result = subprocess.run(
                ['pgrep', '-f', 'Cursor'],
                capture_output=True,
                text=True
            )
            return result.returncode == 0
        except Exception:
            return False
    
    def get_active_app(self):
        """Get the currently active application name on macOS"""
        try:
            script = '''
            tell application "System Events"
                set frontApp to name of first application process whose frontmost is true
                return frontApp
            end tell
            '''
            result = subprocess.run(
                ['osascript', '-e', script],
                capture_output=True,
                text=True,
                timeout=1
            )
            return result.stdout.strip()
        except Exception:
            return None
    
    def send_approval(self):
        """Send Enter key to approve the edit"""
        try:
            keyboard_controller = keyboard.Controller()
            keyboard_controller.press(Key.enter)
            keyboard_controller.release(Key.enter)
            print(f"[{time.strftime('%H:%M:%S')}] Auto-approved edit")
            return True
        except Exception as e:
            print(f"Error sending approval: {e}")
            return False
    
    def monitor_and_approve(self):
        """Main monitoring loop"""
        print("Cursor Auto-Approve Agent started")
        print("Monitoring for Cursor AI edit approvals...")
        print("Press Ctrl+C to stop\n")
        
        last_app = None
        
        try:
            while True:
                # Check if Cursor is running
                if not self.is_cursor_running():
                    time.sleep(2)
                    continue
                
                # Get active application
                active_app = self.get_active_app()
                
                # If Cursor just became active, it might be showing an approval dialog
                if active_app and 'ursor' in active_app.lower():
                    if last_app != active_app:
                        # Cursor just became active, wait a bit then send approval
                        time.sleep(0.3)
                        self.send_approval()
                    last_app = active_app
                
                time.sleep(self.check_interval)
                
        except KeyboardInterrupt:
            print("\n\nStopping agent...")
            sys.exit(0)
        except Exception as e:
            print(f"Error in monitoring loop: {e}")
            sys.exit(1)

def main():
    # Check if pynput is installed
    try:
        import pynput
    except ImportError:
        print("Error: pynput is not installed.")
        print("Install it with: pip install pynput")
        sys.exit(1)
    
    agent = CursorAutoApprove()
    agent.monitor_and_approve()

if __name__ == "__main__":
    main()

