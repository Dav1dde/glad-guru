#!/bin/bash

set -x

DOCS=(es1.1 es2.0 es3 es3.0 es3.1 gl2.1 gl4)

rm -rf build
mkdir build
cd build

mkdir assets
for doc in ${DOCS[*]}
do
    mkdir "assets/${doc}"
done

git clone --depth 1 https://github.com/KhronosGroup/OpenGL-Refpages.git
cd OpenGL-Refpages

make || true

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

python generate_index.py build/assets/ > build/assets/index.json
