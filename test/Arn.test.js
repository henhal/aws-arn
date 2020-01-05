const Arn = require('../Arn');
const {expect} = require('chai');

describe('ARN tests', () => {
  it('should parse an ARN with a / separated resource part', () => {
    const s = 'aws:arn:s3:eu-west-1:123456789:bucket/path/object';
    const arn = Arn.parse(s);

    expect(arn).to.eql({
      scheme: 'aws',
      partition: 'arn',
      service: 's3',
      region: 'eu-west-1',
      accountId: '123456789',
      resourcePart: 'bucket/path/object',
      resource: {
        type: 'bucket',
        id: 'path/object',
        qualifier: undefined
      }
    });

    expect(arn.format()).to.eql(s);
  });

  it('should parse an ARN with a : separated resource part', () => {
    const s = 'aws:arn:lambda:eu-west-1:123456789:Layer:my-layer:42';
    const arn = Arn.parse(s);

    expect(arn).to.eql({
      scheme: 'aws',
      partition: 'arn',
      service: 'lambda',
      region: 'eu-west-1',
      accountId: '123456789',
      resourcePart: 'Layer:my-layer:42',
      resource: {
        type: 'Layer',
        id: 'my-layer',
        qualifier: '42'
      }
    });

    expect(arn.format()).to.eql(s);
  });

  it('should return null if attempting to parse an incomplete ARN', () => {
    expect(Arn.parse('aws:arn:lambda:eu-west-1:123456789:')).to.be.null;
  });

  it('should return null if attempting to parse an invalid ARN', () => {
    expect(Arn.parse('')).to.be.null;
    expect(Arn.parse(42)).to.be.null;
    expect(Arn.parse(null)).to.be.null;
    expect(Arn.parse()).to.be.null;
  });
});