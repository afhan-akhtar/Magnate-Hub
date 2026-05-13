"use client";
import menu_data from "@/data/MenuData";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavMenu = () => {
  const currentRoute = usePathname();

  const isMenuItemActive = (menuLink: string) => currentRoute === menuLink;
  const isSubMenuItemActive = (subMenuLink: string) =>
    currentRoute === subMenuLink;

  // ✅ desktop menu: Wishlist remove
  const desktopMenu = menu_data.filter((menu) => menu.link !== "/wishlist");

  return (
    <ul className="navigation">
      {desktopMenu.map((menu) => (
        <li
          key={menu.id}
          className={menu.has_dropdown ? "menu-item-has-children" : ""}
        >
          <Link
            href={menu.link}
            className={`${
              isMenuItemActive(menu.link) ||
              (menu.sub_menus &&
                menu.sub_menus.some(
                  (sub_m) => sub_m.link && isSubMenuItemActive(sub_m.link)
                ))
                ? "active"
                : ""
            }`}
          >
            {menu.title}
          </Link>

          {menu.has_dropdown && menu.sub_menus && (
            <ul className="sub-menu">
              {menu.sub_menus.map((sub_m, i) => (
                <li key={i}>
                  <Link
                    href={sub_m.link}
                    className={`${
                      sub_m.link && isSubMenuItemActive(sub_m.link)
                        ? "active"
                        : ""
                    }`}
                  >
                    {sub_m.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NavMenu;
