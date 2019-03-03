import json
import os
from collections import defaultdict


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('assets')
    ns = parser.parse_args()

    data = defaultdict(list)

    for root, dirs, files in os.walk(ns.assets):
        for file in files:
            name = os.path.splitext(file)[0].lower()
            data[name].append(os.path.relpath(os.path.join(root, file), ns.assets))

    print(json.dumps(data))


if __name__ == '__main__':
    main()
