import os

from lxml import html, etree
from lxml.html.clean import Cleaner
import io
import re


def clean(inp):
    with open(inp, 'rb') as f:
        source = html.fromstring(f.read(), parser=html.HTMLParser(encoding='utf-8', default_doctype=False))

    root = source
    for (element, attribute, link, pos) in root.iterlinks():
        if '.' not in link or not attribute == 'href':
            continue

        symbol, ext = link.split('.', 1)
        if ext in ('xml', 'html', 'xhtml'):
            element.set(attribute, symbol)

    cleaner = Cleaner(
        remove_tags=['body'],
        kill_tags=['head'],
        comments=True,
        processing_instructions=True,
        remove_unknown_tags=False
    )
    cleaned = cleaner.clean_html(source)

    return etree.tounicode(cleaned, method='html')


def main():
    import argparse

    parser = argparse.ArgumentParser()
    # parser.add_argument('--output', type=argparse.FileType('w'), default=sys.stdout)
    # parser.add_argument('input')
    parser.add_argument('dir')
    parser.add_argument('--dry', action='store_true', default=False)
    ns = parser.parse_args()

    for name in os.listdir(ns.dir):
        path = os.path.join(ns.dir, name)
        data = clean(path)

        if not ns.dry:
            os.unlink(path)

        with open(os.path.splitext(path)[0] + '.html', 'w', encoding='utf-8') as fobj:
            fobj.write(data)


if __name__ == '__main__':
    main()
