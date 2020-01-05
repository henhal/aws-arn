function parseResourcePart(resourcePart) {
  const parts = resourcePart.match(/^([^:/]+)\/(.+)$/) || resourcePart.match(/^(.+?):(.+?):(.+)$/);

  if (parts) {
    const [, type, id, qualifier] = parts;

    return {type, id, qualifier};
  }

  return {id: resourcePart};
}

class Arn {
  static parse(s) {
    if (typeof s !== 'string') {
      return null;
    }

    const [scheme, partition, service, region, accountId, ...resourceParts] = s.split(':');
    const resourcePart = resourceParts.join(':');

    if (!resourcePart) {
      return null;
    }

    return new Arn({
      scheme,
      partition,
      service,
      region,
      accountId,
      resourcePart
    });
  }

  constructor({scheme = 'aws', partition = 'arn', service, region, accountId, resourcePart}) {
    Object.assign(this, {
      scheme, partition, service, region, accountId, resourcePart, resource: parseResourcePart(resourcePart)
    });
  }

  format() {
    const {scheme, partition, service, region, accountId, resourcePart} = this;

    return [scheme, partition, service, region, accountId, resourcePart].join(':');
  }

  toString() {
    return this.format();
  }
}

module.exports = Arn;
