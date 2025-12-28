# Cursor AI Auto-Approve Agent

> ⚠️ **DISCLAIMER: USE AT YOUR OWN RISK - RESEARCH PURPOSES ONLY**
> 
> This software is provided for **educational and research purposes only**. 
> 
> **WARNING:**
> - This tool automatically approves AI-generated code edits without human review
> - **This can introduce bugs, security vulnerabilities, or unwanted changes to your codebase**
> - **Use at your own risk** - the authors are not responsible for any damage, data loss, or issues caused by using this tool
> - Always review AI-generated code changes before accepting them in production environments
> - This tool bypasses the normal review process and should **NOT** be used in critical or production codebases
> - Users are responsible for understanding the implications and risks before using this software
> 
> **By using this software, you acknowledge that you understand the risks and agree to use it solely for research and educational purposes.**

---

This agent automatically presses Enter/Return when Cursor's AI asks for edit approval internally.

## Quick Start

The easiest way to get started:

```bash
./start_cursor_agent.sh
```

This will automatically install dependencies and start the agent.

## Installation Options

### Option 1: Smart Python Script (Recommended)

1. Install dependencies:
```bash
pip3 install -r requirements.txt
# or
pip3 install pynput
```

2. Run the agent:
```bash
python3 cursor_auto_approve_smart.py
```

### Option 2: Basic Python Script

```bash
python3 cursor_auto_approve.py
```

### Option 3: Shell Script (No Python dependencies)

1. Make the script executable:
```bash
chmod +x cursor_auto_approve_simple.sh
```

2. Run the agent:
```bash
./cursor_auto_approve_simple.sh
```

### Option 4: AppleScript Version

Run the AppleScript directly:
```bash
osascript cursor_auto_approve.applescript
```

## How It Works

The agent continuously monitors:
- Whether Cursor is running
- Whether Cursor is the active/frontmost application
- When Cursor becomes active (which often happens when showing approval dialogs)

When Cursor becomes active, it automatically sends an Enter key press to approve the edit.

## Usage Tips

### Background Mode

Run the agent in the background (daemon mode):

```bash
python3 cursor_auto_approve_smart.py --background
```

Or use the control script:

```bash
./cursor_agent_ctl.sh start
```

### Control Script (Recommended)

The `cursor_agent_ctl.sh` script makes it easy to manage the agent:

```bash
# Start the agent
./cursor_agent_ctl.sh start

# Check status
./cursor_agent_ctl.sh status

# View logs
./cursor_agent_ctl.sh logs        # Follow logs in real-time
./cursor_agent_ctl.sh logs 50     # Show last 50 lines

# Stop the agent
./cursor_agent_ctl.sh stop

# Restart the agent
./cursor_agent_ctl.sh restart
```

### Foreground Mode

Run in foreground to see real-time output:

```bash
python3 cursor_auto_approve_smart.py
```

Press `Ctrl+C` to stop.

### Auto-start on Login

Add to your `~/.zshrc` or `~/.bash_profile`:

```bash
# Auto-start Cursor approval agent
~/cursor_agent_ctl.sh start
```

Or directly:

```bash
nohup python3 ~/cursor_auto_approve_smart.py --background > /dev/null 2>&1 &
```

## Logging

The agent logs all activity to `~/.cursor_agent.log` by default. You can:

- View logs: `tail -f ~/.cursor_agent.log`
- Use the control script: `./cursor_agent_ctl.sh logs`
- Specify custom log file: `python3 cursor_auto_approve_smart.py --log-file /path/to/log`

## Security Note

This script requires accessibility permissions on macOS:
1. Go to System Preferences → Security & Privacy → Privacy → Accessibility
2. Add Terminal (or iTerm, if you use that) to the allowed apps
3. You may also need to grant permissions when first running the script

## Advanced Options

### Command Line Options

```bash
python3 cursor_auto_approve_smart.py [OPTIONS]

Options:
  --background, -d    Run as background daemon
  --log-file PATH     Path to log file (default: ~/.cursor_agent.log)
  --pid-file PATH     Path to PID file (default: ~/.cursor_agent.pid)
  -h, --help          Show help message
```

### Customization

You can modify the script to:
- Change the approval key (currently Enter)
- Adjust the check interval (currently 300ms)
- Change the minimum approval interval (currently 500ms)
- Filter by specific dialog types
- Add custom detection logic

### Configuration

Edit `cursor_auto_approve_smart.py` to customize:
- `min_approval_interval`: Minimum time between approvals (seconds)
- Check interval in `monitor_loop()`: How often to check for Cursor activation
- Approval key: Change `Key.enter` to another key if needed

## Troubleshooting

- **Script doesn't work**: Make sure Terminal has Accessibility permissions
- **Too many approvals**: Increase the `check_interval` or add more conditions
- **Not detecting Cursor**: Check that Cursor's process name matches (it should contain "ursor")

