from glad_json import JsonGenerator
from glad.plugin import find_specifications


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('--out-path', default='build')
    parser.add_argument('--specification', default='gl')
    parser.add_argument('--api', default='gl')
    parser.add_argument('--version', default=None)
    parser.add_argument('--profile', default='compatibility')

    config = JsonGenerator.Config()
    config.init_parser(parser)

    ns = parser.parse_args()

    config.update_from_object(ns, ignore_additional=True)
    config.validate()

    specification = find_specifications()[ns.specification].from_remote()

    generator = JsonGenerator(ns.out_path)
    feature_set = generator.select(specification, ns.api, ns.version, ns.profile, None, config)
    generator.generate(specification, feature_set, config)


if __name__ == '__main__':
    main()
