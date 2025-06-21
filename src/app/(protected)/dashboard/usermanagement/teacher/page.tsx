import GenericPage from '@/features/user-management/components/generic-page'
import { teacherConfig } from '@/features/user-management/config/teacher'

export default function TeacherPage() {
  return <GenericPage userType="teacher" config={teacherConfig} />
} 