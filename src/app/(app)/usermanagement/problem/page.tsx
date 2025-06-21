import GenericPage from '@/features/user-management/components/generic-page'
import { problemConfig } from '@/features/user-management/config/problem'

export default function ProblemPage() {
  return <GenericPage userType="problem" config={problemConfig} />
} 