import { logger } from '@utils/logger';

/**
 * App-wide bootstrap tasks that should run once before the UI mounts:
 * font loading, crash reporting setup, feature flags, etc.
 *
 * Auth/session restoration is handled separately by AuthProvider since it
 * needs to render a loading state.
 */
export const bootstrapApp = async (): Promise<void> => {
  try {
    // Placeholder for: Font.loadAsync(), Sentry.init(), analytics setup, etc.
    logger.info('SkillBridge bootstrap complete');
  } catch (error) {
    logger.error('Bootstrap failed', error);
  }
};
