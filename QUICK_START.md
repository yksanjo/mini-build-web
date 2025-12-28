# Quick Start Guide

## 🚀 Start the Agent

```bash
./cursor_agent_ctl.sh start
```

## 📊 Check Status

```bash
./cursor_agent_ctl.sh status
```

## 📝 View Logs

```bash
./cursor_agent_ctl.sh logs        # Real-time logs
./cursor_agent_ctl.sh logs 50     # Last 50 lines
```

## 🛑 Stop the Agent

```bash
./cursor_agent_ctl.sh stop
```

## 🔄 Restart

```bash
./cursor_agent_ctl.sh restart
```

## 📍 Files

- **Log file**: `~/.cursor_agent.log`
- **PID file**: `~/.cursor_agent.pid`

## ⚙️ Manual Start (Foreground)

```bash
python3 cursor_auto_approve_smart.py
```

## ⚙️ Manual Start (Background)

```bash
python3 cursor_auto_approve_smart.py --background
```

## 🔐 First Time Setup

1. Install dependencies:
   ```bash
   pip3 install -r requirements.txt
   ```

2. Grant Accessibility permissions:
   - System Preferences → Security & Privacy → Privacy → Accessibility
   - Add Terminal (or your terminal app)

3. Start the agent:
   ```bash
   ./cursor_agent_ctl.sh start
   ```

