import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/img/logo/logo-green.png";
import MobileMenu from "./MobileMenu";
import { useState } from "react";
import UserIcon from "@/svg/UserIcon";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface MobileSidebarProps {
  offCanvas: boolean;
  setOffCanvas: (offCanvas: boolean) => void;
}

const Offcanvas = ({ offCanvas, setOffCanvas }: MobileSidebarProps) => {
  // const [searchValue, setSearchValue] = useState("");
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchValue(event.target.value);
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setSearchValue("");
  //   setOffCanvas(false);
  // };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className={offCanvas ? "mobile-menu-visible" : ""}>
      <div className="tgmobile__menu">
        <nav className="tgmobile__menu-box">
          <div onClick={() => setOffCanvas(false)} className="close-btn">
            <i className="fa-solid fa-xmark"></i>
          </div>

          <div
            className="tgmobile__menu-outer"
            style={{
              marginTop: "90px",
            }}
          >
            <MobileMenu />
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="btn btn-primary d-flex align-items-center gap-2 mt-2 mx-4"
                style={{ justifyContent: "center" }}
              >
                <UserIcon />
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="btn btn-danger mt-2"
                style={{
                  marginLeft: "20px",
                  marginRight: "20px",
                  width: "85%",
                }}
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      </div>
      <div
        onClick={() => setOffCanvas(false)}
        className="tgmobile__menu-backdrop"
      ></div>
    </div>
  );
};

export default Offcanvas;
