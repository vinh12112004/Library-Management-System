#!/bin/bash

# folder chứa component TSX

COMPONENT_DIR="src/components"

# 1️⃣ Đổi .tsx → .jsx

for f in "$COMPONENT_DIR"/*.tsx; do
new="${f%.tsx}.jsx"
mv "$f" "$new"
echo "Renamed $f → $new"
done

# 2️⃣ Xóa TypeScript type annotations

for f in "$COMPONENT_DIR"/*.jsx; do
# Xóa : type, = type, as type
sed -i -E 's/:[^=;,)]+//g' "$f"
sed -i -E 's/=\s*[^;]+//g' "$f"
sed -i -E 's/as\s+[^;,)]+//g' "$f"

```
# Xóa interface và type declarations
sed -i -E '/^interface\s+\w+\s*{/,/^}/d' "$f"
sed -i -E '/^type\s+\w+\s*=/d' "$f"

echo "Cleaned TS types in $f"
```

done

echo "✅ Conversion from TSX → JSX done!"
