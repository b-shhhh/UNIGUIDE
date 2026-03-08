module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/index.ts',
        '!src/app.ts',
        '!src/__tests__/**',
        '!src/controllers/**',
        '!src/routes/**',
        '!src/scripts/**',
        '!src/models/**',
        '!src/repositories/**',
    ],
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
    moduleNameMapper: {
        "^uuid$": "<rootDir>/src/__tests__/__mocks__/uuid.js",
    },
    coverageThreshold: {
        global: {
            statements: 85,
            functions: 85,
            lines: 85,
        },
    },
};
