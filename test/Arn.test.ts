import {expect} from 'chai';

import Arn from '../src/Arn';

describe('ARN tests', () => {
  it('should parse an ARN with a / separated resource part', () => {
    const s = 'aws:arn:s3:eu-west-1:123456789:bucket/path/object';
    const arn = Arn.parse(s, true);

    expect(arn).to.eql({
      scheme: 'aws',
      partition: 'arn',
      service: 's3',
      region: 'eu-west-1',
      accountId: '123456789',
      resourcePart: 'bucket/path/object'
    });

    expect(arn.resource).to.eql({
      type: 'bucket',
      id: 'path/object',
      qualifier: undefined
    });

    expect(arn.format()).to.eql(s);
  });

  it('should parse an ARN with a : separated resource part', () => {
    const s = 'aws:arn:lambda:eu-west-1:123456789:Layer:my-layer:42';
    const arn = Arn.parse(s, true);

    expect(arn).to.eql({
      scheme: 'aws',
      partition: 'arn',
      service: 'lambda',
      region: 'eu-west-1',
      accountId: '123456789',
      resourcePart: 'Layer:my-layer:42'
    });

    expect(arn.resource).to.eql({
      type: 'Layer',
      id: 'my-layer',
      qualifier: '42'
    });

    expect(arn.format()).to.eql(s);
  });

  it('should keep the parsed resource in sync if mutating resourcePart', () => {
    const arn = Arn.parse('aws:arn:lambda:eu-west-1:123456789:Layer:my-layer:42') ||
        expect.fail('Could not parse ARN');

    arn.resourcePart = `${arn.resource.type}:${arn.resource.id}:43`;

    expect(arn.resourcePart).to.eql('Layer:my-layer:43');
    expect(arn.resource).to.eql({
      type: 'Layer',
      id: 'my-layer',
      qualifier: '43'
    });

    expect(arn.format()).to.eql('aws:arn:lambda:eu-west-1:123456789:Layer:my-layer:43');
  });

  it('should not allow mutating the parsed resource', () => {
    const arn = Arn.parse('aws:arn:lambda:eu-west-1:123456789:Layer:my-layer:42') ||
        expect.fail('Could not parse ARN');

    // This test case isn't really useful anymore since TS won't allow mutating a get-only field, and adding a
    // no-op setter seems contraproductive, so in order not to remove the test completely, we simply
    // expect this call to throw, and then expect the properties to be unchanged. ¯\_(ツ)_/¯
    expect(() => {
      // @ts-ignore
      arn.resource = {type: 'foo', id: 'bar', qualifier: 'baz'};
    }).to.throw();

    expect(arn.resourcePart).to.eql('Layer:my-layer:42');
    expect(arn.resource).to.eql({
      type: 'Layer',
      id: 'my-layer',
      qualifier: '42'
    });

    expect(arn.format()).to.eql('aws:arn:lambda:eu-west-1:123456789:Layer:my-layer:42');
  });

  it('should return null if attempting to parse an incomplete ARN', () => {
    expect(Arn.parse('aws:arn:lambda:eu-west-1:123456789:')).to.be.null;
    expect(Arn.parse('aws:arn:lambda:eu-west-1:123456789:', false)).to.be.null;
  });

  it('should return null if attempting to parse an incomplete ARN with fail=false', () => {
    expect(Arn.parse('aws:arn:lambda:eu-west-1:123456789:', false)).to.be.null;
  });

  it('should throw if attempting to parse an incomplete ARN with fail=true', () => {
    expect(() => Arn.parse('aws:arn:lambda:eu-west-1:123456789:', true)).to.throw();
  });

  it('should return null if attempting to parse an invalid ARN', () => {
    expect(Arn.parse('')).to.be.null;
    expect(Arn.parse(42 as any)).to.be.null;
    expect(Arn.parse(null as any)).to.be.null;
    // @ts-ignore
    expect(Arn.parse()).to.be.null;
  });
});