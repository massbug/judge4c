"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export const Navbar = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean); // Filter out empty strings
  const t = useTranslations('nav');

  return (
    <Breadcrumb>
      <BreadcrumbList className="rounded-lg border border-border bg-background px-3 py-2 shadow-sm shadow-black/5">
        {/* If pathname is "/", display the Home icon inside BreadcrumbPage */}
        {pathSegments.length === 0 ? (
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Home size={16} strokeWidth={2} aria-hidden="true" />
              <span className="sr-only">{t('home')}</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <>
            {/* Always show Home as the first BreadcrumbLink */}
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home size={16} strokeWidth={2} aria-hidden="true" />
                <span className="sr-only">{t('home')}</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {pathSegments.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {index === pathSegments.length - 1 ? (
                    <BreadcrumbPage>{item}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                    >
                      {item}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index !== pathSegments.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
