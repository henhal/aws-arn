type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * A parsed ARN resource.
 * Resources can consist of only an ID or a type, an ID and an optional qualifier:
 * arn:partition:service:region:account-id:resource-id
 * arn:partition:service:region:account-id:resource-type/resource-id
 * arn:partition:service:region:account-id:resource-type:resource-id
 */
export interface ArnResource {
  id: string;
  type?: string;
  qualifier?: string;
}

/**
 * The components of a parsed ARN
 */
export interface ArnComponents {
  /**
   * Scheme, e.g. "arn"
   */
  scheme: string;
  /**
   * Partition, e.g. "aws" or "aws-cn"
   */
  partition: string;
  /**
   * Service, e.g. "dynamodb"
   */
  service: string;
  /**
   * Region, e.g. "us-west-1"
   */
  region: string;
  /**
   * Account ID, e.g. "123456789"
   */
  accountId: string;
  /**
   * Resource, e.g. "my_bucket/my_key" or "layer:my_layer:42"
   */
  resourcePart: string
}

/**
 * Error thrown when attempting to parse invalid ARNs
 */
export class InvalidArnError extends Error {
  constructor (
      message = 'ARN must be a string on the form scheme:partition:service:region:accountId:resourcePart'
  ) {
    super(message);
  }
}

function parseResourcePart(resourcePart: string): ArnResource {
  const parts = resourcePart.match(/^([^:/]+)\/(.+)$/) || resourcePart.match(/^(.+?):(.+?):(.+)$/);

  if (parts) {
    const [, type, id, qualifier] = parts;

    return {type, id, qualifier};
  }

  return {id: resourcePart};
}

function invalidArn(fail = false, message?: string) {
  if (fail) {
    throw new InvalidArnError(message);
  }
  return null;
}

export type ArnInput = Optional<ArnComponents, 'scheme' | 'partition'>;

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
class Arn implements ArnComponents {
  readonly scheme: string;
  readonly partition: string;
  readonly service: string;
  readonly region: string;
  readonly accountId: string;
  resourcePart: string;

  /**
   * Parse an ARN string into an Arn object
   * @param s ARN string
   * @param [fail] Whether to throw instead of returning null
   * @returns {null|Arn} An Arn object, or null if the argument was invalid
   */
  static parse(s: string, fail?: false): Arn | null;

  /**
   * Parse an ARN string into an Arn object, throwing an error if invalid
   * @param s ARN string
   * @param fail Whether to throw instead of returning null
   * @returns {Arn} An Arn object
   * @throws Error
   */
  static parse(s: string, fail: true): Arn;

  static parse(s: string, fail = false): Arn | null {
    // noinspection SuspiciousTypeOfGuard
    if (typeof s !== 'string') {
      return invalidArn(fail);
    }

    const [scheme, partition, service, region, accountId, ...resourceParts] = s.split(':');
    const resourcePart = resourceParts.join(':');

    if (!resourcePart) {
      return invalidArn(fail);
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
   * @param components ARN components object (scheme and partition are optional)
   * @param [components.scheme=aws] Scheme
   * @param [components.partition=arn] Partition
   * @param components.service Service
   * @param components.region Region
   * @param components.accountId Account ID
   * @param components.resourcePart Resource part
   */
  constructor(
      {
        scheme = 'aws',
        partition = 'arn',
        service,
        region,
        accountId,
        resourcePart
      }: ArnInput) {
    this.scheme = scheme;
    this.partition = partition;
    this.service = service;
    this.region = region;
    this.accountId = accountId;
    this.resourcePart = resourcePart;
  }

  /**
   * Get a parsed representation of the resource part. Note that this property cannot be mutated, but if
   * resourcePart is mutated, resource will reflect the change.
   * @returns ArnResource
   */
  get resource(): ArnResource {
    return parseResourcePart(this.resourcePart);
  }

  /**
   * Format this Arn object into an ARN string.
   * @returns string
   */
  format(): string {
    const {scheme, partition, service, region, accountId, resourcePart} = this;

    return [scheme, partition, service, region, accountId, resourcePart].join(':');
  }

  toString(): string {
    return this.format();
  }
}

export default Arn;