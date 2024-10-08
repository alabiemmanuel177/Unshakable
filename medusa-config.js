const dotenv = require('dotenv');

let ENV_FILE_NAME = '';
switch (process.env.NODE_ENV) {
	case 'production':
		ENV_FILE_NAME = '.env.production';
		break;
	case 'staging':
		ENV_FILE_NAME = '.env.staging';
		break;
	case 'test':
		ENV_FILE_NAME = '.env.test';
		break;
	case 'development':
	default:
		ENV_FILE_NAME = '.env';
		break;
}

try {
	dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
	process.env.ADMIN_CORS || 'http://localhost:7000,http://localhost:7001';

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS;

const DATABASE_URL = process.env.DATABASE_URL;
const REDIS_URL = process.env.REDIS_URL;

const plugins = [
	`medusa-fulfillment-manual`,
	`medusa-payment-manual`,
	{
		resolve: `medusa-file-s3`,
		options: {
			s3_url: process.env.S3_URL,
			bucket: process.env.S3_BUCKET,
			region: process.env.S3_REGION,
			access_key_id: process.env.S3_ACCESS_KEY_ID,
			secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
			cache_control: process.env.S3_CACHE_CONTROL,
			// optional
			download_file_duration: process.env.S3_DOWNLOAD_FILE_DURATION,
		},
	},
	{
		resolve: `medusa-payment-paypal`,
		options: {
			sandbox: process.env.PAYPAL_SANDBOX,
			clientId: process.env.PAYPAL_CLIENT_ID,
			clientSecret: process.env.PAYPAL_CLIENT_SECRET,
			authWebhookId: process.env.PAYPAL_AUTH_WEBHOOK_ID,
		},
	},
	{
		resolve: `medusa-plugin-algolia`,
		options: {
			applicationId: process.env.ALGOLIA_APP_ID,
			adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY,
			settings: {
				products: {
					indexSettings: {
						searchableAttributes: ['title', 'description'],
						attributesToRetrieve: [
							'id',
							'title',
							'description',
							'handle',
							'thumbnail',
							'variants',
							'variant_sku',
							'options',
							'collection_title',
							'collection_handle',
							'images',
							'gender',
							'external',
						],
					},
				},
			},
		},
	},
];

const modules = {
	eventBus: {
		resolve: '@medusajs/event-bus-redis',
		options: {
			redisUrl: REDIS_URL,
		},
	},
	cacheService: {
		resolve: '@medusajs/cache-redis',
		options: {
			redisUrl: REDIS_URL,
		},
	},
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
	redis_url: REDIS_URL,
	database_url: DATABASE_URL,
	database_type: 'postgres',
	store_cors: STORE_CORS,
	admin_cors: ADMIN_CORS,
	jwtSecret: process.env.JWT_SECRET,
	cookieSecret: process.env.COOKIE_SECRET,
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
	projectConfig,
	plugins,
	modules,
};
