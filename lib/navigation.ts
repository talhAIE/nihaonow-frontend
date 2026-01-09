import { useRouter } from 'next/navigation';

/**
 * Centralized route definitions for type-safe navigation
 */
export const routes = {
  // Auth routes
  login: '/login',
  register: '/register',
  forgetPassword: '/forget-password',
  resetPassword: '/reset-password',
  
  // Landing/Welcome
  home: '/',
  welcome: '/welcome',
  comingSoon: '/coming-soon',
  onboarding: '/onboarding',
  
  // Student routes
  student: {
    dashboard: '/student/dashboard',
    units: '/student/units',
    topics: (chapterId?: number) => 
      chapterId ? `/student/topics?chapterId=${chapterId}` : '/student/topics',
    introduction: (topicId?: number) => 
      topicId ? `/student/introduction?topicId=${topicId}` : '/student/introduction',
    scenario: (scenarioId?: number) => 
      scenarioId ? `/student/scenario?scenarioId=${scenarioId}` : '/student/scenario',
    feedback: '/student/feedback',
    level: '/student/level',
  },
  
  // Teacher routes
  teacher: {
    dashboard: '/teacher',
  },
} as const;

/**
 * Navigation utility hook that wraps Next.js router with type-safe routes
 */
export function useNavigation() {
  const router = useRouter();

  return {
    // Direct router access for edge cases
    router,
    
    // Auth navigation
    goToLogin: () => router.push(routes.login),
    goToRegister: () => router.push(routes.register),
    goToForgetPassword: () => router.push(routes.forgetPassword),
    goToResetPassword: () => router.push(routes.resetPassword),
    
    // Landing/Welcome
    goToHome: () => router.push(routes.home),
    goToWelcome: () => router.push(routes.welcome),
    goToComingSoon: () => router.push(routes.comingSoon),
    goToOnboarding: () => router.push(routes.onboarding),
    
    // Student navigation
    goToStudentDashboard: () => router.push(routes.student.dashboard),
    goToStudentUnits: () => router.push(routes.student.units),
    goToStudentTopics: (chapterId?: number) => router.push(routes.student.topics(chapterId)),
    goToStudentIntroduction: (topicId?: number) => router.push(routes.student.introduction(topicId)),
    goToStudentScenario: (scenarioId?: number) => router.push(routes.student.scenario(scenarioId)),
    goToStudentFeedback: () => router.push(routes.student.feedback),
    goToStudentLevel: () => router.push(routes.student.level),
    
    // Teacher navigation
    goToTeacherDashboard: () => router.push(routes.teacher.dashboard),
    
    // Generic navigation with custom path
    goTo: (path: string) => router.push(path),
  };
}

/**
 * Navigation utility for use outside of React components (e.g., in utility functions)
 * Note: This should only be used when useNavigation hook is not available
 */
export const navigation = {
  routes,
};
