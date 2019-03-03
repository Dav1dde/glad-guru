from glad.generator import BaseGenerator
from glad.sink import LoggingSink
from glad.config import Config, ConfigOption

import json
import os


class JsonConfig(Config):
    PRETTY = ConfigOption(
        converter=bool,
        default=False,
        description='Enables pretty printed ouput'
    )

    SERIALIZER = ConfigOption(
        converter=str,
        default='default',
        description='Serializer to use'
    )


class JsonGenerator(BaseGenerator):
    Config = JsonConfig

    @property
    def id(self):
        return "json"

    def generate(self, spec, feature_set, config, sink=LoggingSink(__name__)):
        output_path = os.path.join(self.path, feature_set.name + '.json')
        if not os.path.exists(self.path):
            os.makedirs(self.path)

        serializer = {
            'default': DefaultSerializer,
            'symbols': SymbolSerializer
        }[config['SERIALIZER']]()

        with open(output_path, 'wb') as output:
            json.dump(serializer.serialize(feature_set), output, indent=4 if config['PRETTY'] else None)


class Serializer(object):
    def serialize(self, feature_set):
        raise NotImplementedError


class DefaultSerializer(Serializer):
    def serialize(self, feature_set):
        result = dict()

        for name, data in (self.serialize_command(command) for command in feature_set.commands):
            result[name] = data

        for name, data in (self.serialize_enum(enum) for enum in feature_set.enums):
            result[name] = data

        for name, data in (self.serialize_extension(extension) for extension in feature_set.extensions):
            result[name] = data

        for name, data in (self.serialize_feature(feature) for feature in feature_set.features):
            result[name] = data

        return result

    def serialize_command(self, command):
        return command.name, dict(
            type='command',
            # name=command.name,
            alias=command.alias,
            api=command.api,
            parameters=[self.serialize_parameter(param) for param in command.params],
            ret=self.serialize_type(command.proto.ret)
        )

    def serialize_parameter(self, param):
        return dict(
            name=param.name,
            group=param.group,
            type=self.serialize_type(param.type),
        )

    def serialize_type(self, type_):
        return type_.type

    def serialize_enum(self, enum):
        return enum.name, dict(
            type='enum',
            name=enum.name,
            value=enum.value
        )

    def serialize_extension(self, extension):
        return extension.name, dict(
            type='extension',
            name=extension.name,
            platform=extension.platform,
            supported=extension.supported
        )

    def serialize_feature(self, feature):
        return feature.name, dict(
            type='feature',
            name=feature.name,
            version=feature.version,
            supported=feature.supported
        )


class SymbolSerializer(Serializer):
    def serialize(self, feature_set):
        result = []

        result.extend(command.name for command in feature_set.commands)
        result.extend(enum.name for enum in feature_set.enums)
        result.extend(extension.name for extension in feature_set.extensions)
        result.extend(feature.name for feature in feature_set.features)

        return result
