/**
 * OpenTelemetry Tracing Configuration
 * Configured for SigNoz integration (Story 1.8)
 */
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT } from '@opentelemetry/semantic-conventions';
import { logger } from './utils/logger';

const SERVICE_NAME = process.env.SERVICE_NAME || 'cropfresh-service-order';
const SERVICE_VERSION = process.env.SERVICE_VERSION || '1.0.0';
const ENVIRONMENT = process.env.NODE_ENV || 'development';

const OTEL_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
    || 'http://signoz-otel-collector.monitoring.svc.cluster.local:4318/v1/traces';

const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [SEMRESATTRS_SERVICE_NAME]: SERVICE_NAME,
        [SEMRESATTRS_SERVICE_VERSION]: SERVICE_VERSION,
        [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: ENVIRONMENT,
    }),
    traceExporter: new OTLPTraceExporter({
        url: OTEL_ENDPOINT,
    }),
    instrumentations: [
        getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-http': { enabled: true },
            '@opentelemetry/instrumentation-express': { enabled: true },
            '@opentelemetry/instrumentation-grpc': { enabled: true },
            '@opentelemetry/instrumentation-pg': { enabled: true },
            '@opentelemetry/instrumentation-redis': { enabled: true },
        }),
    ],
});

try {
    sdk.start();
    logger.info({ serviceName: SERVICE_NAME, endpoint: OTEL_ENDPOINT }, 'OpenTelemetry tracing initialized');
} catch (error) {
    logger.error(error, 'Error initializing OpenTelemetry tracing');
}

process.on('SIGTERM', () => {
    sdk.shutdown()
        .then(() => logger.info('OpenTelemetry tracing terminated'))
        .catch((error) => logger.error(error, 'Error terminating tracing'));
});

export { sdk };
