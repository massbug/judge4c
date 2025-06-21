"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // 添加首页
    breadcrumbs.push({ label: "首页", href: "/" });

    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // 根据路径段生成标签
      let label = segment;

      // 路径映射
      const pathMap: Record<string, string> = {
        dashboard: "仪表板",
        management: "管理面板",
        profile: "用户信息",
        "change-password": "修改密码",
        problems: "题目",
        problemset: "题目集",
        admin: "管理后台",
        teacher: "教师平台",
        student: "学生平台",
        usermanagement: "用户管理",
        userdashboard: "用户仪表板",
        protected: "受保护",
        app: "应用",
        auth: "认证",
        "sign-in": "登录",
        "sign-up": "注册",
      };

      // 如果是数字，可能是题目ID，显示为"题目详情"
      if (/^\d+$/.test(segment)) {
        label = "详情";
      } else if (pathMap[segment]) {
        label = pathMap[segment];
      } else {
        // 将 kebab-case 转换为中文
        label = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      // 最后一个项目不添加链接
      if (index === segments.length - 1) {
        breadcrumbs.push({ label });
      } else {
        breadcrumbs.push({ label, href: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem className="hidden md:block">
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
