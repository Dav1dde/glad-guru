import os

from lxml import html
from lxml.html.clean import Cleaner
import io
import re


def clean(inp):
    source = html.parse(inp)

    root = source.getroot()
    for (element, attribute, link, pos) in root.iterlinks():
        if '.' not in link or not attribute == 'href':
            continue

        symbol, ext = link.split('.', 1)
        if ext in ('xml', 'html', 'xhtml'):
            element.set(attribute, symbol)

    cleaner = Cleaner(remove_tags=['body'], kill_tags=['head'], comments=False)
    cleaned = cleaner.clean_html(source)

    data = io.BytesIO()
    cleaned.write(data, encoding='utf-8', method='html')

    cleaned = data.getvalue().decode('utf-8')
    cleaned = strip_xml_tag(cleaned)

    return cleaned


def strip_xml_tag(data):
    return re.sub(r'<\?xml[^>]+>', '', data)


def main():
    import argparse

    parser = argparse.ArgumentParser()
    # parser.add_argument('--output', type=argparse.FileType('w'), default=sys.stdout)
    # parser.add_argument('input')
    parser.add_argument('dir')
    ns = parser.parse_args()

    for name in os.listdir(ns.dir):
        path = os.path.join(ns.dir, name)
        data = clean(path)

        os.unlink(path)
        with open(os.path.splitext(path)[0] + '.html', 'wb') as fobj:
            fobj.write(data.encode('utf-8'))


if __name__ == '__main__':
    main()
