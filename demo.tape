# VHS tape script for recording DevPulse demo
# Install VHS: brew install vhs / winget install charmbracelet.vhs
# Run: vhs demo.tape

Output demo.gif

Set FontSize 16
Set Width 1200
Set Height 680
Set Padding 20
Set Theme "Catppuccin Mocha"

Type "npx devpulse"
Enter
Sleep 2s

Type "j"
Sleep 500ms
Type "j"
Sleep 500ms

Enter
Sleep 3s

Type "devpulse wtf 'Error: listen EADDRINUSE: address already in use :::3000'"
Enter
Sleep 3s

Type "devpulse top"
Enter
Sleep 3s
