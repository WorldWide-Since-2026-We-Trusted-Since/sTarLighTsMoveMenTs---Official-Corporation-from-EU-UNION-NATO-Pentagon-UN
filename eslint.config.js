/**
 * @license
 * SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 */

import js from '@eslint/js';
import ts from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  {
      // Standalone infrastructure / auxiliary runtimes that are not part of the
      // main React+TypeScript application. They use their own module systems and
      // runtime globals (Cloudflare Workers, Node servers, Python tooling, q/kdb+),
      // so they are intentionally excluded from the project's ESLint run.
      ignores: [
        'dist',
        'node_modules',
        'public/documents',
        'public/finance-system',
        '.secure_vault',
        '.eslintrc.cjs',
        'cloudflare-worker.js',
        'gov-autonomous-worker.js',
        'scripts/*.js',
        'scripts/*.cjs',
        'compliance-portal/server.mjs',
        'pnia-infra',
        'mesh',
        'HNOSS_Compliance_Connectors',
        'crypto-tokenization',
        'pnai-system',
        'pnia-governance-catalog',
        'security-validation',
        'analysis',
        'protocols',
      ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
    // Node.js server file — uses Node globals (process, Buffer, console).
    files: ['server/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    // React plugin + recommended rules must live in the same config object so
    // ESLint can resolve the `react/` rule prefixes.
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react': react,
    },
    languageOptions: {
      // The new JSX transform (react-jsx) does not require `React` in scope,
      // and TypeScript already handles undefined-variable checks.
      globals: {
        process: 'readonly',
        console: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
        window: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        NodeJS: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      // Obsolete under the automatic JSX runtime.
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      // TypeScript already validates prop types and undefined identifiers.
      'react/prop-types': 'off',
      'react/no-undef': 'off',
      'no-undef': 'off',
      // Stylistic rules disabled because the project intentionally uses raw
      // quotes inside display strings (they render correctly in browsers) and
      // literal "//" labels in the UI. These are not functional defects.
      'react/no-unescaped-entities': 'off',
      'react/jsx-no-comment-textnodes': 'off',
    },
  }
);
