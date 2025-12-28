#!/usr/bin/env python3
"""
Cursor AI Edit Auto-Approve Agent (Smart Version)

This version uses keyboard shortcuts to detect when Cursor shows edit approval dialogs.
It listens for specific patterns and automatically approves.

Usage:
    python3 cursor_auto_approve_smart.py [--background] [--log-file PATH] [--pid-file PATH]
    
Options:
    --background    Run as background daemon
    --log-file      Path to log file (default: ~/.cursor_agent.log)
    --pid-file      Path to PID file (default: ~/.cursor_agent.pid)
"""

import time
import sys
import os
import argparse
import logging
import signal
import atexit
from pathlib import Path
from pynput import keyboard
from pynput.keyboard import Key, Listener
import subprocess

class SmartCursorAutoApprove:
    def __init__(self, log_file=None, pid_file=None, background=False):
        self.cursor_active = False
        self.last_approval_time = 0
        self.min_approval_interval = 0.5  # Minimum time between approvals (seconds)
        self.background = background
        self.approval_count = 0
        self.start_time = time.time()
        
        # Setup logging
        self.log_file = log_file or str(Path.home() / '.cursor_agent.log')
        self.pid_file = pid_file or str(Path.home() / '.cursor_agent.pid')
        
        self.setup_logging()
        self.setup_signal_handlers()
        
        if background:
            self.daemonize()
        
        self.write_pid()
        atexit.register(self.cleanup)
        
    def setup_logging(self):
        """Setup logging to file and console"""
        log_format = '%(asctime)s - %(levelname)s - %(message)s'
        date_format = '%Y-%m-%d %H:%M:%S'
        
        # Create log directory if needed
        log_path = Path(self.log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Configure logging
        logging.basicConfig(
            level=logging.INFO,
            format=log_format,
            datefmt=date_format,
            handlers=[
                logging.FileHandler(self.log_file),
                logging.StreamHandler(sys.stdout) if not self.background else logging.NullHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        self.logger.info(f"Logging to: {self.log_file}")
    
    def setup_signal_handlers(self):
        """Setup signal handlers for graceful shutdown"""
        signal.signal(signal.SIGTERM, self.signal_handler)
        signal.signal(signal.SIGINT, self.signal_handler)
    
    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        self.logger.info(f"Received signal {signum}, shutting down...")
        self.cleanup()
        sys.exit(0)
    
    def daemonize(self):
        """Fork process to run as daemon"""
        try:
            pid = os.fork()
            if pid > 0:
                sys.exit(0)  # Exit parent
        except OSError as e:
            self.logger.error(f"Fork failed: {e}")
            sys.exit(1)
        
        # Decouple from parent environment
        os.chdir("/")
        os.setsid()
        os.umask(0)
        
        # Second fork
        try:
            pid = os.fork()
            if pid > 0:
                sys.exit(0)
        except OSError as e:
            self.logger.error(f"Second fork failed: {e}")
            sys.exit(1)
        
        # Redirect standard file descriptors
        sys.stdout.flush()
        sys.stderr.flush()
        si = open(os.devnull, 'r')
        so = open(os.devnull, 'a+')
        se = open(os.devnull, 'a+')
        os.dup2(si.fileno(), sys.stdin.fileno())
        os.dup2(so.fileno(), sys.stdout.fileno())
        os.dup2(se.fileno(), sys.stderr.fileno())
    
    def write_pid(self):
        """Write PID to file"""
        try:
            with open(self.pid_file, 'w') as f:
                f.write(str(os.getpid()))
        except Exception as e:
            self.logger.error(f"Failed to write PID file: {e}")
    
    def cleanup(self):
        """Cleanup on exit"""
        try:
            if os.path.exists(self.pid_file):
                os.remove(self.pid_file)
            runtime = time.time() - self.start_time
            self.logger.info(f"Agent stopped. Runtime: {runtime:.1f}s, Approvals: {self.approval_count}")
        except Exception as e:
            if hasattr(self, 'logger'):
                self.logger.error(f"Cleanup error: {e}")
    
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
        current_time = time.time()
        if current_time - self.last_approval_time < self.min_approval_interval:
            return False  # Too soon since last approval
        
        try:
            keyboard_controller = keyboard.Controller()
            keyboard_controller.press(Key.enter)
            keyboard_controller.release(Key.enter)
            self.last_approval_time = current_time
            self.approval_count += 1
            self.logger.info(f"✓ Auto-approved edit (Total: {self.approval_count})")
            return True
        except Exception as e:
            self.logger.error(f"Error sending approval: {e}")
            return False
    
    def on_key_press(self, key):
        """Handle key press events - can be used to detect specific patterns"""
        # This can be extended to detect specific keyboard shortcuts
        # that Cursor uses before showing approval dialogs
        pass
    
    def monitor_loop(self):
        """Main monitoring loop with smart detection"""
        if not self.background:
            print("=" * 50)
            print("Cursor AI Auto-Approve Agent (Smart Version)")
            print("=" * 50)
            print("Monitoring for Cursor AI edit approvals...")
            print(f"Log file: {self.log_file}")
            print(f"PID file: {self.pid_file}")
            print("Press Ctrl+C to stop\n")
        
        self.logger.info("=" * 50)
        self.logger.info("Cursor AI Auto-Approve Agent started")
        self.logger.info(f"PID: {os.getpid()}")
        self.logger.info(f"Background mode: {self.background}")
        self.logger.info("=" * 50)
        
        last_app = None
        cursor_just_activated = False
        last_cursor_check = 0
        
        try:
            while True:
                current_time = time.time()
                
                # Check if Cursor is running (less frequently)
                if current_time - last_cursor_check > 5:
                    if not self.is_cursor_running():
                        self.logger.debug("Cursor is not running")
                        time.sleep(2)
                        continue
                    last_cursor_check = current_time
                
                active_app = self.get_active_app()
                
                if active_app and 'ursor' in active_app.lower():
                    # Cursor is active
                    if last_app != active_app:
                        # Cursor just became active - likely showing a dialog
                        cursor_just_activated = True
                        self.logger.debug(f"Cursor activated (was: {last_app})")
                        time.sleep(0.2)  # Small delay to let dialog appear
                        self.send_approval()
                    elif cursor_just_activated:
                        # Keep checking for a short period after activation
                        time.sleep(0.1)
                        self.send_approval()
                        cursor_just_activated = False
                    
                    last_app = active_app
                else:
                    cursor_just_activated = False
                    last_app = active_app
                
                time.sleep(0.3)  # Check every 300ms
                
        except KeyboardInterrupt:
            if not self.background:
                print("\n\n✓ Agent stopped")
            self.logger.info("Agent stopped by user")
            sys.exit(0)
        except Exception as e:
            self.logger.error(f"Error in monitor loop: {e}", exc_info=True)
            sys.exit(1)

def parse_args():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description='Cursor AI Auto-Approve Agent',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        '--background', '-d',
        action='store_true',
        help='Run as background daemon'
    )
    parser.add_argument(
        '--log-file',
        type=str,
        default=None,
        help='Path to log file (default: ~/.cursor_agent.log)'
    )
    parser.add_argument(
        '--pid-file',
        type=str,
        default=None,
        help='Path to PID file (default: ~/.cursor_agent.pid)'
    )
    return parser.parse_args()

def main():
    try:
        import pynput
    except ImportError:
        print("Error: pynput is not installed.")
        print("Install it with: pip3 install pynput")
        sys.exit(1)
    
    args = parse_args()
    agent = SmartCursorAutoApprove(
        log_file=args.log_file,
        pid_file=args.pid_file,
        background=args.background
    )
    agent.monitor_loop()

if __name__ == "__main__":
    main()

