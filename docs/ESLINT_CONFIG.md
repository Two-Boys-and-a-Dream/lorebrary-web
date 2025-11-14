# ESLint Configuration

This project uses a modern, strict ESLint configuration for React development.

## Installed Plugins

- **eslint** - Core ESLint engine
- **eslint-plugin-react** - React-specific linting rules
- **eslint-plugin-react-hooks** - Enforces React Hooks rules
- **eslint-plugin-jsx-a11y** - Accessibility checks for JSX
- **@tanstack/eslint-plugin-query** - Best practices for TanStack Query
- **eslint-plugin-jest** - Jest testing best practices
- **eslint-plugin-import** - ES6+ import/export syntax validation
- **eslint-config-prettier** - Disables ESLint rules that conflict with Prettier

## Rule Categories

### Error Prevention

- `no-unused-vars` - Catches unused variables (ignores underscore-prefixed)
- `no-var` - Enforces const/let over var
- `prefer-const` - Requires const when variables aren't reassigned
- `no-duplicate-imports` - Prevents duplicate imports

### React Best Practices

- `react/jsx-key` - Requires key prop in lists
- `react/no-array-index-key` - Warns against using array indices as keys
- `react/no-unstable-nested-components` - Prevents component definitions inside components
- `react/jsx-no-useless-fragment` - Removes unnecessary fragments
- `react/self-closing-comp` - Enforces self-closing tags when appropriate

### React Hooks

- `react-hooks/rules-of-hooks` - Enforces Hook call rules
- `react-hooks/exhaustive-deps` - Checks effect dependencies

### Code Quality

- `eqeqeq` - Requires === instead of ==
- `no-implicit-coercion` - Prevents confusing type coercions like !!value
- `prefer-template` - Prefers template literals over string concatenation
- `object-shorthand` - Uses ES6 object shorthand
- `no-nested-ternary` - Warns against nested ternary operators

### Accessibility

- Full `jsx-a11y/recommended` rules for WCAG compliance

## Running ESLint

```bash
# Lint entire project
npm run lint

# Lint specific files
npx eslint src/components/**/*.js

# Auto-fix issues where possible
npx eslint src/ --fix
```

## IDE Integration

### VS Code

Install the ESLint extension:

```
ext install dbaeumer.vscode-eslint
```

Add to `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "javascriptreact"]
}
```

## Pre-commit Hooks

This project uses `simple-git-hooks` to run linting before pushes:

- `pre-commit`: Runs Prettier
- `pre-push`: Runs ESLint

## Disabling Rules

When you need to disable a rule, use inline comments sparingly:

```javascript
// Single line
// eslint-disable-next-line no-console
console.log('debug info')

// Multiple lines
/* eslint-disable no-console */
console.log('start')
console.log('end')
/* eslint-enable no-console */
```

## Future Enhancements

Consider adding:

- **TypeScript** with `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`
- **eslint-plugin-import** rules for better import organization
- **Custom rules** specific to your team's conventions
