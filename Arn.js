function parseResourcePart(resourcePart) {
  const parts = resourcePart.match(/^([^:/]+)\/(.+)$/) || resourcePart.match(/^(.+?):(.+?):(.+)$/);

  if (parts) {
    const [, type, id, qualifier] = parts;

    return {type, id, qualifier};
  }

  return {id: resourcePart};
}

/**
 * Amazon Resource Names (ARNs) uniquely identify AWS resources.
 *
 * The following are the general formats for ARNs; the specific components and values used depend on the AWS service.
 * To use an ARN, replace the italicized text in the example with your own information.
 *
 * arn:partition:service:region:account-id:resource-id
 * arn:partition:service:region:account-id:resource-type/resource-id
 * arn:partition:service:region:account-id:resource-type:resource-id
 *
 * _partition_
 * The partition that the resource is in. For standard AWS Regions, the partition is aws. If you have resources in other
 * partitions, the partition is aws-partitionname. For example, the partition for resources in the China (Beijing)
 * Region is aws-cn.
 *
 * _service_
 * The service namespace that identifies the AWS product (for example, Amazon S3, IAM, or Amazon RDS).
 *
 * _region_
 * The Region that the resource resides in. The ARNs for some resources do not require a Region, so this component might
 * be omitted.
 *
 * _account-id_
 * The ID of the AWS account that owns the resource, without the hyphens. For example, 123456789012. The ARNs for some
 * resources don't require an account number, so this component might be omitted.
 *
 * _resource_ or _resource-type_
 * The content of this part of the ARN varies by service. A resource identifier can be the name or ID of the resource
 * (for example, user/Bob or instance/i-1234567890abcdef0) or a resource path. For example, some resource identifiers
 * include a parent resource (sub-resource-type/parent-resource/sub-resource) or a qualifier such as a version
 * (resource-type:resource-name:qualifier).
 *
 * https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html
 */
class Arn {
  /**
   * Parse an ARN string into an Arn object
   * @param {string} s ARN string
   * @returns {null|Arn} An Arn object, or null if the argument was invalid
   */
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

  /**
   * Create an Arn object from ARN components
   *
   * @param {object} components ARN components object
   * @param {string} [components.scheme=aws] Scheme
   * @param {string} [components.partition=arn] Partition
   * @param {string} components.service Service
   * @param {string} components.region Region
   * @param {string} components.accountId Account ID
   * @param {string} components.resourcePart Resource part
   */
  constructor({scheme = 'aws', partition = 'arn', service, region, accountId, resourcePart}) {
    Object.assign(this, {
      scheme, partition, service, region, accountId, resourcePart
    });
  }

  /**
   * Get a parsed representation of the resource part. Note that this property cannot be mutated, but if
   * resourcePart is mutated, resource will reflect the change.
   * @returns {{[type], id, [qualifier]}}
   */
  get resource() {
    return parseResourcePart(this.resourcePart);
  }

  /**
   * Format this Arn object into an ARN string.
   * @returns {string}
   */
  format() {
    const {scheme, partition, service, region, accountId, resourcePart} = this;

    return [scheme, partition, service, region, accountId, resourcePart].join(':');
  }

  toString() {
    return this.format();
  }
}

module.exports = Arn;
