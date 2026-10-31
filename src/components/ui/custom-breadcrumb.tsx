import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface CustomBreadCrumbProps {
  breadCrumbPage: string;
  breadCrumbItems?: { link: string; label: string }[];
}

export const CustomBreadCrumb = ({ breadCrumbPage, breadCrumbItems }: CustomBreadCrumbProps) => {
  return (
    <Breadcrumb className="text-xs">
      <BreadcrumbList className="text-xs text-[#86868b]">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1.5 hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadCrumbItems &&
          breadCrumbItems.map((item, i) => (
            <React.Fragment key={i}>
              <BreadcrumbSeparator className="text-[#86868b]/60" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={item.link} className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        <BreadcrumbSeparator className="text-[#86868b]/60" />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
            {breadCrumbPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
