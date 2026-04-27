#!/bin/bash
set -e

cd "$(dirname "$0")"
echo "Previewing Open Source Repository Intelligence at http://localhost:8000"
python3 -m http.server 8000
