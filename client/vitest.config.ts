import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            globals: true, // describe, it, expect, beforeEach, afterEach
            environment: 'happy-dom', // fix document is not defined
            setupFiles: './src/test-setup.ts',
            coverage: {
                provider: 'istanbul',
                include: ['src/components/**/*.{js,jsx,ts,tsx}'],
                exclude: ['src/components/**/*.{types,stories,constants,test,spec}.{js,jsx,ts,tsx}', 'src/components/ui'],
                thresholds: {
                    global: {
                        branches: 80,
                        functions: 80,
                        lines: 80,
                        statements: 80
                    }
                }
            }
        }
    })
);
