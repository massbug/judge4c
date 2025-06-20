"use client"

import { UserTable } from "./components/user-table"
import { adminConfig } from "./config/admin"
import { teacherConfig } from "./config/teacher"
import { guestConfig } from "./config/guest"
import { problemConfig } from "./config/problem"

interface UserManagementProps {
  userType: "admin" | "teacher" | "guest" | "problem"
}

export function UserManagement({ userType }: UserManagementProps) {
  // 根据用户类型返回对应的配置
  if (userType === "admin") {
    return (
      <UserTable
        config={adminConfig}
        data={[]}
      />
    )
  }
  if (userType === "teacher") {
    return (
      <UserTable
        config={teacherConfig}
        data={[]}
      />
    )
  }
  if (userType === "guest") {
    return (
      <UserTable
        config={guestConfig}
        data={[]}
      />
    )
  }
  if (userType === "problem") {
    return (
      <UserTable
        config={problemConfig}
        data={[]}
      />
    )
  }
  
  return <div>暂不支持 {userType} 类型</div>
} 