import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            globals: true, // describe, it, expect, beforeEach, afterEach
            environment: 'happy-dom', // fix document is not defined
            setupFiles: './src/test-setup.ts',
            include: [
                'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', // Only include our source tests
            ],
            exclude: [
                '**/tests/**', // Exclude E2E Playwright tests from Vitest
                '**/node_modules/**',
                '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
            ],
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
