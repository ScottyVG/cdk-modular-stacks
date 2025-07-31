import { Construct } from 'constructs';
import { Bucket, BucketEncryption, BlockPublicAccess, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';

export interface S3BucketProps {
  bucketName?: string;
  enableVersioning?: boolean;
  enableEncryption?: boolean;
  removalPolicy?: RemovalPolicy;
  blockPublicAccess?: boolean;
}

export class S3Bucket extends Construct {
  public readonly bucket: Bucket;

  constructor(scope: Construct, id: string, props: S3BucketProps) {
    super(scope, id);

    this.bucket = new Bucket(this, 'Bucket', {
      bucketName: props.bucketName, // Optional - CDK will generate unique name if not provided
      versioned: props.enableVersioning ?? false,
      encryption: props.enableEncryption ? BucketEncryption.S3_MANAGED : BucketEncryption.S3_MANAGED,
      blockPublicAccess: props.blockPublicAccess === false 
        ? new BlockPublicAccess({
            blockPublicAcls: false,
            blockPublicPolicy: false,
            ignorePublicAcls: false,
            restrictPublicBuckets: false,
          })
        : BlockPublicAccess.BLOCK_ALL,
      removalPolicy: props.removalPolicy ?? RemovalPolicy.RETAIN,
      // Enhanced security settings
      enforceSSL: true,
      eventBridgeEnabled: false,
      transferAcceleration: false,
      // Prevent accidental deletion and enforce bucket owner control
      objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
    });
  }
}