#!/usr/bin/env bash
# Regenerates every placeholder image and the placeholder reel in content/media.
# Real photos replace these files. Keep the filenames, or update content/site.js.
# Treatment: "one lamp on an empty stage": a single warm light, haze, vignette, grain.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=content/media
# Real media now lives in content/media. This script would overwrite the hero,
# poster, reel and social image with placeholders, so it refuses to run unless forced.
if [ -z "${FORCE:-}" ]; then
  echo "Refusing to overwrite real media in $OUT. Run with FORCE=1 if you really want placeholders." >&2
  exit 1
fi
FONT=/tmp/caption-italic.ttf
# drawtext cannot parse "[" or "]" in a path, so copy the system italic serif somewhere plain.
cp "/usr/share/fonts/google-noto-vf/NotoSerif-Italic[wght].ttf" "$FONT"
mkdir -p "$OUT/photos" "$OUT/reel"

# frame DIR NAME W H "SMALLW [SMALLW...]" "gradient spec" SEED "caption"
# Writes NAME-W.jpg (large) plus one NAME-SMALLW.jpg per listed width, from one render.
frame() {
  local dir=$1 name=$2 w=$3 h=$4 smalls=$5 grad=$6 seed=$7 cap=$8
  local labels="[a]" chain="" i=0 caption=""
  local maps=(-map "[big]" -frames:v 1 -q:v 4 "$OUT/$dir/${name}-${w}.jpg")
  if [ -n "$cap" ]; then
    caption=",drawtext=fontfile=${FONT}:text='${cap}':fontsize=$(( w / 44 )):fontcolor=#f4efe7@0.5:x=$(( w / 32 )):y=h-$(( w / 18 ))"
  fi
  for sw in $smalls; do
    i=$((i+1)); labels+="[s$i]"
    chain+=";[s$i]scale=${sw}:-2,format=yuv420p[o$i]"
    maps+=(-map "[o$i]" -frames:v 1 -q:v 4 "$OUT/$dir/${name}-${sw}.jpg")
  done
  ffmpeg -hide_banner -loglevel error -y \
    -f lavfi -i "gradients=s=${w}x${h}:${grad}" \
    -f lavfi -i "perlin=s=${w}x${h}:octaves=6:persistence=0.55:random_mode=seed:seed=${seed}" \
    -filter_complex "[0]format=rgb24[g];[1]format=rgb24,eq=contrast=1.35[p];[g][p]blend=all_mode=softlight:all_opacity=0.6,vignette=a=PI/3.5,noise=alls=9:allf=t:all_seed=${seed}${caption},split=$((i+1))${labels};[a]format=yuv420p[big]${chain}" \
    "${maps[@]}"
  echo "  $dir/$name"
}

echo "Hero"
frame photos hero-portrait  1400 2000 "700 1000" "c0=#efd2a1:c1=#a8653a:c2=#3a1420:c3=#160b0f:c4=#160b0f:x0=980:y0=560:x1=1500:y1=1700:type=radial"  11 ""
frame photos hero-landscape 2560 1440 "1280 1920" "c0=#efd2a1:c1=#a8653a:c2=#3a1420:c3=#160b0f:c4=#160b0f:x0=1800:y0=520:x1=2500:y1=1500:type=radial" 12 ""

echo "Headshot"
frame photos headshot-main  1200 1600 600  "c0=#f0dcb8:c1=#a86b45:c2=#4a1d28:c3=#160b0f:x0=700:y0=520:x1=1150:y1=1500:type=radial" 13 "Placeholder headshot"

echo "Gallery"
frame photos headshot-01     1200 1600 600  "c0=#efd2a1:c1=#a86b45:c2=#4a1d28:c3=#160b0f:x0=420:y0=480:x1=900:y1=1500:type=radial"  21 "Placeholder headshot, 2026"
frame photos still-long-weekend 2400 1600 1200 "c0=#e9c48f:c1=#8a4a30:c2=#3a1420:c3=#160b0f:x0=1700:y0=500:x1=2400:y1=1500:type=radial" 22 "Placeholder still, The Long Weekend"
frame photos editorial-01    1200 1600 600  "c0=#f6ecdc:c1=#cfa77e:c2=#6a3a3a:c3=#160b0f:x0=600:y0=300:x1=1300:y1=1500:type=radial"   23 "Placeholder editorial"
frame photos still-hollow-season 2400 1600 1200 "c0=#d9d2c4:c1=#7d6a5c:c2=#2e1a22:c3=#160b0f:x0=600:y0=400:x1=1500:y1=1400:type=radial"  24 "Placeholder still, Hollow Season"
frame photos still-seagull   2400 1600 1200 "c0=#efd2a1:c1=#9c5a3a:c2=#5a2230:c3=#160b0f:x0=1200:y0=0:x1=1200:y1=1300:type=radial" 25 "Placeholder stage still, The Seagull"
frame photos headshot-02     1200 1600 600  "c0=#dcd4c6:c1=#8c6c5c:c2=#3a1a24:c3=#160b0f:x0=820:y0=420:x1=1300:y1=1500:type=radial"  26 "Placeholder headshot, 2025"
frame photos still-salt-flats 2400 1600 1200 "c0=#f1dfbd:c1=#b98a5a:c2=#5a2a2a:c3=#160b0f:x0=1200:y0=1500:x1=1200:y1=0:type=linear" 27 "Placeholder still, Salt Flats"
frame photos editorial-02    1200 1600 600  "c0=#e9c48f:c1=#7a3b2b:c2=#2a1119:c3=#160b0f:x0=300:y0=900:x1=1000:y1=1700:type=radial"   28 "Placeholder editorial"
frame photos still-residents 2400 1600 1200 "c0=#e6cfae:c1=#94604a:c2=#3a1420:c3=#160b0f:x0=500:y0=900:x1=1500:y1=1600:type=radial"  29 "Placeholder still, The Residents"
frame photos headshot-03     1200 1600 600  "c0=#efd2a1:c1=#b3603f:c2=#5a2230:c3=#160b0f:x0=560:y0=560:x1=1000:y1=1600:type=radial"  30 "Placeholder headshot, 2024"

echo "Reel poster + placeholder reel"
frame reel showreel-poster 1920 1080 "960 1280" "c0=#efd2a1:c1=#a8653a:c2=#3a1420:c3=#160b0f:c4=#160b0f:x0=1250:y0=380:x1=1900:y1=1100:type=radial" 41 "Placeholder showreel poster"
ffmpeg -hide_banner -loglevel error -y \
  -loop 1 -framerate 24 -i "$OUT/reel/showreel-poster-1920.jpg" \
  -f lavfi -i "perlin=s=1280x720:octaves=5:persistence=0.55:random_mode=seed:seed=42:tscale=0.02:rate=24" \
  -filter_complex "[0]scale=1280:720,zoompan=z='min(zoom+0.0006,1.18)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=240:s=1280x720:fps=24,format=rgb24[v];[1]format=rgb24,eq=contrast=1.3[p];[v][p]blend=all_mode=softlight:all_opacity=0.35,drawtext=fontfile=${FONT}:text='Placeholder showreel':fontsize=34:fontcolor=#f4efe7@0.75:x=(w-text_w)/2:y=(h-text_h)/2,format=yuv420p" \
  -t 10 -c:v libopenh264 -b:v 1400k -pix_fmt yuv420p -movflags +faststart -an "$OUT/reel/showreel.mp4"
echo "  reel/showreel.mp4"

echo "Social preview"
ffmpeg -hide_banner -loglevel error -y -i "$OUT/photos/hero-landscape-2560.jpg" -vf "crop=2560:1344:0:48,scale=1200:630" -q:v 4 "$OUT/og-image.jpg"
echo "Done."
