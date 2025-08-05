# Contributing to ItsyPoker

Thank you for your interest in contributing to ItsyPoker! We welcome contributions from developers of all skill levels. This guide will help you get started with contributing to our web-based planning poker application.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Contributions](#making-contributions)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Architecture Guidelines](#architecture-guidelines)
- [Release Process](#release-process)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)
- Git
- A modern web browser with WebRTC support

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your forked repository:
   ```bash
   git clone https://github.com/your-username/ItsyPoker.git
   cd ItsyPoker
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/ItsyPoker.git
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development environment:
   ```bash
   # Terminal 1: Start signalling server
   npm run server:start
   
   # Terminal 2: Start client development server
   npm run client:dev
   ```

3. Verify setup by accessing `http://localhost:8080`

### Project Structure

```
ItsyPoker/
├── client/                     # Svelte frontend
│   ├── src/
│   │   ├── components/        # Svelte components
│   │   └── lib/               # TypeScript modules
├── server/                     # Node.js signalling server
├── tests/                      # Test suites
│   ├── client/               # Client-side tests
│   └── server/               # Server-side tests
├── CLAUDE.md                 # Development guidelines
└── README.md                 # Project documentation
```

## Making Contributions

### Types of Contributions

We welcome several types of contributions:

- **Bug Fixes**: Fix existing issues or problems
- **Feature Enhancements**: Add new functionality or improve existing features
- **Documentation**: Improve README, code comments, or create guides
- **Testing**: Add or improve test coverage
- **Performance**: Optimize code performance or bundle size
- **Accessibility**: Improve application accessibility
- **UI/UX**: Enhance user interface and experience

### Before You Start

1. **Check existing issues** to avoid duplicate work
2. **Create an issue** for new features or major changes to discuss the approach
3. **Start small** if you're new to the project
4. **Ask questions** in issues or discussions if you need clarification

## Coding Standards

### TypeScript

- Use **strict TypeScript** with proper type annotations
- Prefer interfaces over type aliases for object shapes
- Use meaningful variable and function names
- Follow existing naming conventions

```typescript
// Good
interface ParticipantData {
  username: string;
  isHost: boolean;
  hasVoted: boolean;
}

// Avoid
type ParticipantData = {
  username: any;
  isHost: any;
  hasVoted: any;
}
```

### Svelte Components

- Use **TypeScript** in all Svelte components
- Follow reactive programming patterns
- Keep components focused and single-purpose
- Use Svelte stores for shared state

```svelte
<script lang="ts">
  import type { AppState } from '$lib/types';
  import { appState } from '$lib/stores';

  // Component logic here
</script>

<div class="component-container">
  <!-- Template here -->
</div>

<style>
  /* Component-specific styles */
</style>
```

### Styling

- Use **Tailwind CSS** utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use semantic HTML elements

```svelte
<!-- Good -->
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
  Submit Vote
</button>
```

### Code Organization

- **Client code**: Place in appropriate `client/src/` subdirectories
- **Server code**: Keep server logic in `server/` directory
- **Types**: Define shared types in respective `types.ts` files
- **Tests**: Mirror source structure in `tests/` directory

## Testing Guidelines

### Writing Tests

- Write tests for all new features and bug fixes
- Maintain or improve test coverage
- Use descriptive test names that explain what is being tested
- Test both happy path and error scenarios

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup code
  });

  it('should handle user interaction correctly', () => {
    // Arrange
    const input = 'test data';
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm run test

# Run with coverage
npm run test:coverage

# Run specific test files
npm run test -- ComponentName.test.ts
```

### Test Categories

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **WebRTC Tests**: Test peer-to-peer communication
- **API Tests**: Test server endpoints and WebSocket messages

## Pull Request Process

### Creating a Pull Request

1. **Create a branch** from the latest `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards

3. **Write or update tests** for your changes

4. **Run the test suite**:
   ```bash
   npm run test:run
   ```

5. **Build the project** to ensure no errors:
   ```bash
   npm run client:build
   ```

6. **Commit your changes** with a clear message:
   ```bash
   git add .
   git commit -m "feat: add new voting card animation"
   ```

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request** on GitHub

### Pull Request Guidelines

#### Title Format
Use conventional commit format for PR titles:
- `feat: add new feature`
- `fix: resolve bug with WebRTC connections`
- `docs: update README with new instructions`
- `test: add coverage for vote synchronization`
- `refactor: improve state management structure`

#### Description Template
```markdown
## Summary
Brief description of what this PR does.

## Changes Made
- List of specific changes
- Another change
- Final change

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Browser compatibility verified

## Screenshots (if applicable)
Add screenshots for UI changes.

## Related Issues
Closes #123
Relates to #456
```

#### PR Requirements

- [ ] Code follows project coding standards
- [ ] Tests are included and passing
- [ ] Documentation is updated if needed
- [ ] PR title follows conventional commit format
- [ ] No merge conflicts with main branch
- [ ] Changes are focused and atomic

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and builds
2. **Code Review**: Maintainers review code quality and architecture
3. **Testing**: Manual testing of new features
4. **Approval**: At least one maintainer approval required
5. **Merge**: Squash and merge into main branch

## Issue Guidelines

### Reporting Bugs

Use the bug report template and include:

- **Environment**: Browser, OS, Node.js version
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Console Logs**: Any error messages

### Feature Requests

Use the feature request template and include:

- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: Your suggested approach
- **Alternatives Considered**: Other options you thought about
- **Use Cases**: How would this be used?

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## Architecture Guidelines

### Client Architecture

- **Components**: Keep Svelte components small and focused
- **State Management**: Use Svelte stores for shared state
- **WebRTC**: Handle peer connections in dedicated modules
- **Type Safety**: Maintain strict TypeScript throughout

### Server Architecture

- **Lightweight**: Keep server minimal, focused on signalling only
- **WebSocket**: Handle room management and WebRTC relay
- **Error Handling**: Provide clear error messages
- **Scalability**: Consider horizontal scaling implications

### Communication Patterns

- **WebSocket**: For signalling and room management
- **WebRTC DataChannels**: For game state synchronization
- **Type Safety**: Shared interfaces between client and server
- **Error Handling**: Graceful degradation and recovery

### Performance Considerations

- **Bundle Size**: Keep client bundle optimized
- **Memory Usage**: Clean up WebRTC connections properly
- **Network Efficiency**: Minimize signalling server load
- **Latency**: Optimize for real-time communication

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Release Steps

1. Update version in `package.json` files
2. Update `CHANGELOG.md` with release notes
3. Create release tag
4. Deploy to production environments
5. Announce release in discussions

## Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Create issues for bugs and feature requests
- **Documentation**: Check README.md and CLAUDE.md
- **Code**: Review existing code for patterns and examples

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Project documentation

Thank you for contributing to ItsyPoker! Your efforts help make collaborative estimation better for teams worldwide.