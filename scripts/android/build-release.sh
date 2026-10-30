#!/usr/bin/env bash
# Builds and signs the standard Android APK:
#   openGym-<version>.apk      the Standard sideloaded APK: 180 px built in
#
# Usage: scripts/android/build-release.sh <keystore> <password-file> <alias-file> [out-dir]
#   APK_PX        the Standard APK's built-in size, default 180
set -euo pipefail

KS=${1:?keystore}; PASS=${2:?file with the keystore password}; ALIAS=$(cat "${3:?file with the key alias}")
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
OUT=${4:-$PWD}
APK_PX=${APK_PX:-180}
export VITE_CLIP_EXT=webp
: "${ANDROID_HOME:?set ANDROID_HOME}"
BT=$(ls -d "$ANDROID_HOME"/build-tools/* | sort -V | tail -1)

cd "$ROOT/frontend"
VER=$(node -p "require('./package.json').version")
GRADLE_VER=$(sed -n 's/.*versionName "\(.*\)"/\1/p' android/app/build.gradle)
[ "$VER" = "$GRADLE_VER" ] || { echo "package.json says $VER, build.gradle says $GRADLE_VER" >&2; exit 1; }

phone_build() {
  VITE_BUILTIN_CLIP_PX="$1" VITE_APK_VARIANT="standard" npm run build:mobile
}

# The Standard APK (180 px built in)
phone_build "$APK_PX"
(cd android && ./gradlew --no-daemon clean assembleSideloadRelease)
APK_BUILT="$OUT/.openGym-$VER-sideload-unsigned.apk"
cp android/app/build/outputs/apk/sideload/release/app-sideload-release-unsigned.apk "$APK_BUILT"

sign_apk() {
  "$BT/zipalign" -f -p 4 "$1" "$OUT/aligned.apk"
  "$BT/apksigner" sign --ks "$KS" --ks-pass "file:$PASS" --ks-key-alias "$ALIAS" \
    --out "$OUT/$2" "$OUT/aligned.apk"
  rm -f "$OUT/aligned.apk" "$OUT/$2.idsig"
  "$BT/apksigner" verify --print-certs "$OUT/$2" | grep -i "SHA-256"
  (cd "$OUT" && sha256sum "$2" > "$2.sha256")
}

sign_apk "$APK_BUILT" "openGym-$VER.apk"
rm -f "$APK_BUILT"
(cd "$OUT" && cat openGym-"$VER".apk.sha256 > SHA256SUMS)

ls -la "$OUT"/openGym-"$VER".apk
