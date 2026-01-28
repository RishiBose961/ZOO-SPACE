import { Link, useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Badge } from "../ui/badge";

const formatLabel = (text: string) =>
  text
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const BreadCrumb = () => {
  const { pathname } = useLocation();
  const pathnames = pathname.split("/").filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl mt-3 p-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>

          {/* Dynamic Paths */}
          {pathnames.map((path, index) => {
            const isLast = index === pathnames.length - 1;
            const fullPath = `/${pathnames.slice(0, index + 1).join("/")}`;

            return (
              <span key={fullPath} className="flex items-center">
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  {isLast ? (
                    <Badge
                      variant="destructive"
                      className="capitalize pointer-events-none"
                    >
                      {formatLabel(path)}
                    </Badge>
                  ) : (
                    <Link to={fullPath} className="capitalize">
                      {formatLabel(path)}
                    </Link>
                  )}
                </BreadcrumbItem>
              </span>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
