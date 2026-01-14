'use client';

import OnboardingScreen from '@/components/OnboardingScreen';
import { useAppContext } from '@/context/AppContext';
import { useNavigation } from '@/lib/navigation';
import { useEffect } from 'react';
import { useAuthProtection } from '@/hooks/useAuthProtection';

export default function OnboardingPage() {
  useAuthProtection();

  const { state, completeOnboarding } = useAppContext();
  const { goToStudentUnits } = useNavigation();

  useEffect(() => {
    if (state.hasCompletedOnboarding) {
      goToStudentUnits();
    }
  }, [state.hasCompletedOnboarding, goToStudentUnits]);

  if (state.hasCompletedOnboarding) {
    return null;
  }

  return <OnboardingScreen onComplete={completeOnboarding} />;
}

