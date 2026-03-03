# Contributing

Arkstack is built to be framework-flexible/switchable, type-safe, and production-ready. Contributions should preserve these core principles.

## Philosophy

Before submitting changes, ensure your contribution:

- Maintains strict type integrity
- Does not introduce framework coupling
- Preserves backward compatibility unless clearly documented
- Keeps transformation logic separate from transport logic

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies
4. Run the test suite

All changes must include or update tests where applicable.

## Pull Request Guidelines

- Keep PRs focused and atomic
- Do not bundle unrelated changes
- Include clear descriptions of the problem and solution
- Add or update documentation when behavior changes
- Ensure tests pass before submission

## Coding Standards

- TypeScript-first design
- No breaking API changes without version bump
- Avoid hidden side effects
- Prefer explicit configuration over implicit magic

## Commit Convention

Use clear, descriptive commit messages:

- feat: new feature
- fix: bug fix
- docs: documentation updates
- refactor: internal restructuring without API changes
- test: test updates

## Reporting Issues

When reporting bugs, include:

- Arkstack version
- Framework used (Express, H3, etc.)
- Minimal reproduction example
- Expected vs actual behavior

Clear reports accelerate resolution.
