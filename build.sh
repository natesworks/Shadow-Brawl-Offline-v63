# thx gpt
# ════ CONFIG ════
REMOTE_RAW_URL="https://raw.githubusercontent.com/soufgameyt/Shadow-Brawl-Offline-v63/main/version.json"
LOCAL_FILE="./version.json"
APP_PATH="/Applications/NB v63.265.app"
FRIDA_TARGET="NB v63.265"
AGENT_FILE="_agent.js"

# ════ COLORS ════
CYAN=$'\033[96;1m'
YELLOW=$'\033[93;1m'
RED=$'\033[91;1m'
RESET=$'\033[0m'

PREFIX_BUILD="[INFO] [ShadowBrawlOffline::Build]"
PREFIX_UPDATE="[INFO] [ShadowBrawlOffline::UpdateChecker]"

# ════ LOG HELPERS ════
log()    { printf "%s%s %s%s\n" "$CYAN" "$PREFIX_BUILD" "$*" "$RESET"; }
updatelog() { printf "%s%s %s%s\n" "$CYAN" "$PREFIX_UPDATE" "$*" "$RESET"; }
warn()   { printf "%s%s %s%s\n" "$YELLOW" "$PREFIX_UPDATE" "$*" "$RESET"; }
error()  { printf "%s%s %s%s\n" "$RED" "$PREFIX_UPDATE" "$*" "$RESET"; }
fatal()  { printf "%s%s ❌ Error: %s%s\n" "$RED" "$PREFIX_BUILD" "$*" "$RESET"; exit 1; }

# ════ FETCH REMOTE VERSION ════
updatelog "Fetching version from git..."
remote_json=$(curl -fsSL "$REMOTE_RAW_URL") || fatal "Failed to fetch remote version.json."
[[ -z "$remote_json" ]] && fatal "Remote version.json empty."

# ════ READ LOCAL VERSION ════
[[ ! -f "$LOCAL_FILE" ]] && fatal "Local file $LOCAL_FILE not found."
local_json=$(cat "$LOCAL_FILE")

# ════ PARSE VERSION ════
extract_version() {
  local json="$1"
  if command -v jq >/dev/null 2>&1; then
    echo "$json" | jq -r '.version // empty'
  elif command -v python3 >/dev/null 2>&1; then
    python3 -c 'import sys,json; print(json.load(sys.stdin).get("version",""))' <<<"$json"
  else
    echo "$json" | sed -nE 's/.*"version"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/p'
  fi
}

local_version=$(extract_version "$local_json")
remote_version=$(extract_version "$remote_json")
[[ -z "$local_version" ]] && fatal "Could not parse local version.json"
[[ -z "$remote_version" ]] && fatal "Could not parse remote version.json"

# ════ SEMVER UTIL ════
# convert x.y.z → score = x*10000 + y*100 + z
semver_score() {
  local v="${1#v}" # strip leading v
  IFS='.' read -r maj min patch _ <<<"$v"
  maj=${maj:-0} min=${min:-0} patch=${patch:-0}
  echo $((maj*10000 + min*100 + patch))
}

local_score=$(semver_score "$local_version")
remote_score=$(semver_score "$remote_version")
diff=$((remote_score - local_score))

# ════ LOG VERSION STATUS ════
if (( diff == 0 )); then
  updatelog "Local version: $local_version"
  updatelog "Remote version: $remote_version"
  updatelog "You're on the latest version!"
  version_color="$CYAN"
elif (( diff == 1 )); then
  warn "Local version: $local_version"
  warn "Remote version: $remote_version"
  warn "A new version is available!"
  version_color="$YELLOW"
else
  error "Local version: $local_version"
  error "Remote version: $remote_version"
  error "Multiple versions ahead! Update recommended."
  version_color="$RED"
fi

# ════ BUILD & RUN IF UP-TO-DATE ════
if (( diff <= 0 )); then
  # npm install
  if command -v npm >/dev/null 2>&1; then
    log "Building..."
    npm install
  else
    log "⚠️ npm not found — skipping build."
  fi

  # open app
  if [[ -e "$APP_PATH" ]]; then
    log "Opening Brawl Stars..."
    open "$APP_PATH" || log "⚠️ Failed to open app."
  else
    log "⚠️ App not found at $APP_PATH"
  fi

  # run frida
  if command -v frida >/dev/null 2>&1; then
    log "Starting frida..."
    frida "$FRIDA_TARGET" -l "$AGENT_FILE"
  else
    fatal "frida not found in PATH."
  fi

else
  warn "Versions differ. Do you want to update via git pull?"
  read -rp "$(printf "%s%s %s [y/N]: %s" "$YELLOW" "$PREFIX_BUILD" "" "$RESET")" yn
  if [[ "$yn" =~ ^[Yy]$ ]]; then
    if command -v git >/dev/null 2>&1; then
      log "Running git pull..."
      git pull --ff-only || fatal "git pull failed."
      log "Update finished. Re-run build.sh."
    else
      fatal "git not found."
    fi
  else
    warn "Aborted. Please update manually."
  fi
fi
