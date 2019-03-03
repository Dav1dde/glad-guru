import os

from lxml import html
from lxml.html.clean import Cleaner
import io


def clean(inp):
    source = html.parse(inp)

    cleaner = Cleaner(remove_tags=['body'], kill_tags=['head'], with_comments=False)
    cleaned = cleaner.clean_html(source)

    data = io.BytesIO()
    cleaned.write(data, encoding='utf-8', method='html')
    return data.getvalue().decode('utf-8')


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
