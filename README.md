# aws-arn

[![NPM version](https://img.shields.io/npm/v/aws-arn.svg)](https://www.npmjs.com/package/aws-arn)
[![Build Status](https://travis-ci.com/henhal/aws-arn.svg?branch=master)](https://travis-ci.com/henhal/aws-arn)

Parser/utils for AWS ARN:s.

This module provides a simple AWS ARN parser.

Usage:

### Parse an ARN string
```
const Arn = require('aws-arn');

const arn = Arn.parse('aws:arn:s3:eu-west-1:123456789:bucket/path/object');

console.log(arn);

> Arn {
    scheme: 'aws',
    partition: 'arn',
    service: 's3',
    region: 'eu-west-1',
    accountId: '123456789',
    resourcePart: 'bucket/path/object' }
```

Since the resource part of ARNs may have several formats, Arn objects also supply a resource property that returns a parsed representation of the resource part:

```  
const arn = Arn.parse('aws:arn:s3:eu-west-1:123456789:bucket/path/object');
console.log(arn.resource);

> { type: 'bucket', id: 'path/object'}

const arn = Arn.parse('aws:arn:lambda:eu-west-1:123456789:Layer:my-layer:42');
console.log(arn.resource);

> { type: 'Layer', id: 'my-layer', qualifier: '42'}
```

### Create ARN from components

```
const arn = new Arn({
  service: 'lambda',
  region: 'eu-west-1',
  accountId: '123456789',
  resourcePart: 'Layer:my-layer:42'
});

console.log(arn);

> Arn {
    scheme: 'aws',
    partition: 'arn',
    service: 'lambda',
    region: 'eu-west-1',
    accountId: '123456789',
    resourcePart: 'Layer:my-layer:42' }
```

### Format ARN into string

```
const arn = Arn.parse('aws:arn:s3:eu-west-1:123456789:bucket/path/object');

console.log(arn.format());

> aws:arn:s3:eu-west-1:123456789:bucket/path/object
```
