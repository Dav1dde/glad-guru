#!/bin/bash

FULL=0

set -x

DOCS=(es1.1 es2.0 es3 es3.0 es3.1 gl2.1 gl4)

if [ "$FULL" -gt 0 ]; then
    rm -rf build
fi
mkdir -p build
cd build

mkdir assets
for doc in ${DOCS[*]}
do
    mkdir "assets/${doc}"
done

if [ ! -e OpenGL-Refpages ]; then
    git clone --depth 1 https://github.com/KhronosGroup/OpenGL-Refpages.git
fi
cd OpenGL-Refpages

make || true

set -e

cp es1.1/xhtml/*.xml ../assets/es1.1/
cp es2.0/xhtml/*.xml ../assets/es2.0/
cp es3/html/*.xhtml ../assets/es3/
cp es3.0/html/*.xhtml ../assets/es3.0/
cp es3.1/html/*.xhtml ../assets/es3.1/
cp gl2.1/xhtml/*.xml ../assets/gl2.1/
cp gl4/html/*.xhtml ../assets/gl4/

cd ../../

python clean_docs.py build/assets/es1.1/
python clean_docs.py build/assets/es2.0/
python clean_docs.py build/assets/es3/
python clean_docs.py build/assets/es3.0/
python clean_docs.py build/assets/es3.1/
python clean_docs.py build/assets/gl2.1/
python clean_docs.py build/assets/gl4/

rm -rf build/assets/index.json
python generate_index.py build/assets/ -o build/assets/index.json
