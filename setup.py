#!/usr/bin/env python

"""
Glad Json
---------

Simple Json generator for glad.
"""

from setuptools import setup, find_packages

if __name__ == '__main__':
    setup(
        name='glad',
        version='0.1.0',
        description='Glad Json generator',
        long_description=__doc__,
        packages=find_packages(),
        include_package_data=True,
        entry_points={
            'glad.generator': [
                'json = glad_json.__init__:JsonGenerator',
            ]
        },
        keywords='glad generator gl wgl egl gles glx json',
        author='David Herberth',
        author_email='pypi@dav1d.de',
        license='MIT',
        platforms='any'
    )
