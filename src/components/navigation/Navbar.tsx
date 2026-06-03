import React, { useState, useEffect } from "react";
import { HiMiniBars3 } from "react-icons/hi2";
import { useAppSelector } from "@/store/hooks";
import { FaAngleDown } from "react-icons/fa6";
import useOutsideClick from "@/hooks/click-outside-hook";
import useStore from "@/hooks/useStore";

const Navbar: React.FC = () => {
  const [profileDropDownOpened, setProfileDropdownOpened] = useState(false);
  const profileDropdownRef = useOutsideClick<HTMLDivElement>(() =>
    setProfileDropdownOpened(false),
  );

  const { userData: storeUser } = useAppSelector(
    (state) => state.sharedReducer || {},
  );

  const userData = {
    firstName: storeUser?.firstName || "",
    lastName: storeUser?.lastName || "",
    currentRole: storeUser?.currentRole || "",
  };

  const isSidebarExpanded = useAppSelector(
    (state) => state.sharedReducer?.isSidebarExpanded ?? true,
  );

  const { setExpandSidebar, logout } = useStore();

  const handleExpandSidebar = () => {
    setExpandSidebar(!isSidebarExpanded);
  };

  return (
    <div className="h-20 bg-white w-full flex justify-between items-center border-b border-gray-200 shadow-sm">
      <div className="xs:px-2 px-5">
        <HiMiniBars3
          size={30}
          color="#000000"
          className="cursor-pointer hover:text-primary transition"
          onClick={handleExpandSidebar}
        />
      </div>
      <div className="xs:px-2 px-5 flex items-center gap-4">
        <div
          className="p-3 flex justify-center items-center gap-3 sm:gap-5 cursor-pointer hover:bg-gray-50 rounded-lg transition"
          onClick={() => setProfileDropdownOpened(!profileDropDownOpened)}
        >
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            {userData.firstName.charAt(0)}
            {userData.lastName.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <h5 className="text-sm font-bold text-gray-900 whitespace-nowrap">
              {/* {`${userData.firstName} ${userData.lastName}` || "Admin"} */}
              {"Admin"}
            </h5>
            <p className="text-xs font-semibold text-gray-500">
              {userData.currentRole.replace(/_/g, " ")}
            </p>
          </div>
          <div className="p-1.5 rounded-full border border-gray-300">
            <FaAngleDown size={18} color={"#565656"} />
          </div>
        </div>
        {profileDropDownOpened && (
          <div
            ref={profileDropdownRef}
            className="absolute z-10 top-20 right-8 h-fit w-56 bg-white rounded-lg shadow-xl border border-gray-200 p-3"
          >
            <p
              className="font-semibold text-sm text-red-600 cursor-pointer hover:bg-red-50 p-3 rounded-lg transition"
              onClick={logout}
            >
              Logout
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
