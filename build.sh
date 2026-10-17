#!/bin/sh
# Builds a single self-contained HTML file (images + JS + CSS inlined) into dist-single/
set -e
npx esbuild src/main.jsx --bundle --minify --loader:.jpg=dataurl --jsx=automatic --define:process.env.NODE_ENV='"production"' --outdir=build --target=es2019
python3 - <<'PY'
html=open('index.html').read()
css=open('build/main.css').read()
js=open('build/main.js').read().replace('</script','<\\/script')
html=html.replace('<script type="module" src="/src/main.jsx"></script>','<script>'+js+'</script>')
html=html.replace('</head>','<style>'+css+'</style>\n</head>')
import os; os.makedirs('dist-single',exist_ok=True)
open('dist-single/antaryudh.html','w').write(html)
PY
