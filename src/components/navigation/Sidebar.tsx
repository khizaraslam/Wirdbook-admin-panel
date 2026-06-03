import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/images/others/logo.png";
import useStore from "../../hooks/useStore";

interface SidebarProps {
  children: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const isSidebarExpanded = useSelector(
    (state: any) => state.sharedReducer?.isSidebarExpanded ?? true,
  );

  const { setExpandSidebar } = useStore();
  const location = useLocation();

  React.useEffect(() => {
    if (window.innerWidth < 768) {
      setExpandSidebar(false);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpandSidebar(false);
      } else {
        setExpandSidebar(true);
      }
    };

    // Initial check on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleExpandSidebar = () => {
    setExpandSidebar(!isSidebarExpanded);
  };
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setExpandSidebar(false)}
        />
      )}

      <aside
        className={`absolute top-0 left-0 md:relative h-screen z-30 transition-all duration-500 ease-out overflow-hidden ${
          isSidebarExpanded ? "w-full xs:w-2/3 sm:w-1/2 md:w-[230px]" : "w-0"
        } bg-white`}
        style={
          {
            // backgroundImage: `url(/img/sidebarbg.png)`,
            // objectFit: "contain",
            // backgroundSize: "cover",
            // backgroundPosition: "center",
          }
        }
      >
        <div className="min-w-[230px] h-full">
          <nav className="h-full flex flex-col bg-transparent shadow-sm ">
            <div className="flex justify-between items-center relative h-20 border-b border-gray-200">
              {/* <img
                src={logo}
                className="overflow-hidden transition-all w-28 flex justify-center items-center mx-auto"
                alt="Logo"
              /> */}
              <h1 className="text-xl font-bold text-center flex justify-center items-center ml-6">
                Admin Panel
              </h1>
              <button
                onClick={handleExpandSidebar}
                className="absolute z-10 top-8 right-5 block md:hidden cursor-pointer border border-gray-300 px-3 py-1 rounded-lg"
              >
                x
              </button>
            </div>
            <ul className="px-2 overflow-y-auto whitespace-nowrap">
              {children}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
