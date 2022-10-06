# aws-arn

[![NPM version](https://img.shields.io/npm/v/aws-arn.svg)](https://www.npmjs.com/package/aws-arn)
[![Build Status](https://travis-ci.com/henhal/aws-arn.svg?branch=master)](https://travis-ci.com/henhal/aws-arn)

Parser/utils for AWS ARN:s.

This module provides a simple AWS ARN parser.

Note: v2.0.0 rewritten in TypeScript

## Installation

### Node.JS:

```
npm install aws-arn
```

Then within the application do

```
import Arn from 'aws-arn';

```

## API reference

https://henhal.github.io/aws-arn/

## Usage

### 

### Parse an ARN string

> NOTE: V1 always returned `null` if attempting to parse invalid ARNs. 
> V2 however supports passing a second argument `fail` with the value `true` to instead throw an error. 
> This avoids having to deal with the return type `Arn | null`, which simplifies TypeScript usage:
> ```
> const arn = Arn.parse('aws:arn:s3:eu-west-1:123456789:bucket/path/object');
> // arn is of type Arn | null
>
> const arn = Arn.parse('aws:arn:s3:eu-west-1:123456789:bucket/path/object', false);
> // arn is of type Arn | null
> 
> const arn = Arn.parse('aws:arn:s3:eu-west-1:123456789:bucket/path/object', true);
> // arn is of type Arn, or the call threw an error
> ```
```
const arn = Arn.parse('aws:arn:s3:eu-west-1:123456789:bucket/path/object', true);

console.log(arn);

> Arn {
    scheme: 'aws',
    partition: 'arn',
    service: 's3',
    region: 'eu-west-1',
    accountId: '123456789',
    resourcePart: 'bucket/path/object' }
```

Since the resource part of ARNs may have several formats, Arn objects also supply a read-only `resource` property that returns a parsed representation of the resource part:

```  
const arn = Arn.parse('aws:arn:s3:eu-west-1:123456789:bucket/path/object', true);
console.log(arn.resource);

> { type: 'bucket', id: 'path/object'}

const arn = Arn.parse('aws:arn:lambda:eu-west-1:123456789:Layer:my-layer:42', true);
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
const arn = Arn.parse('aws:arn:s3:eu-west-1:123456789:bucket/path/object', true);

console.log(arn.format());

> aws:arn:s3:eu-west-1:123456789:bucket/path/object
```
