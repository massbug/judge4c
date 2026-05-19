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
import { useTranslations } from "next-intl";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const t = useTranslations("Breadcrumb");

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // 添加首页
    breadcrumbs.push({ label: t("home"), href: "/" });

    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // 根据路径段生成标签
      let label = segment;

      // 路径映射
      const pathMap: Record<string, string> = {
        dashboard: t("dashboard"),
        management: t("management"),
        profile: t("profile"),
        "change-password": t("changePassword"),
        problems: t("problems"),
        problem: t("problem"),
        problemset: t("problemset"),
        admin: t("admin"),
        teacher: t("teacher"),
        student: t("student"),
        usermanagement: t("usermanagement"),
        courses: t("courses"),
        assignments: t("assignments"),
        userdashboard: t("userdashboard"),
        protected: t("protected"),
        app: t("app"),
        auth: t("auth"),
        "sign-in": t("signIn"),
        "sign-up": t("signUp"),
      };

      // 如果是数字，可能是题目ID，显示为"题目详情"
      if (/^\d+$/.test(segment)) {
        label = t("detail");
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
