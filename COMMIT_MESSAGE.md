refactor: implement unified type-safe navigation system

Replace all 35 router.push calls with centralized navigation utility

- Create lib/navigation.ts with type-safe route definitions
- Update all hooks, components, and pages to use useNavigation()
- Maintain backward compatibility with existing navigation flows
- Improve code maintainability and developer experience

Files modified: 27 (1 new, 2 hooks, 5 components, 20 pages)
