import { FC, Fragment, ReactNode, useEffect, useState } from "react";
import authImage1 from "../../../assets/images/others/auth-images/authImage1.png";
import authImage2 from "../../../assets/images/others/auth-images/authImage2.png";
import authImage3 from "../../../assets/images/others/auth-images/authImage3.png";
import authImage4 from "../../../assets/images/others/auth-images/authImage4.png";

interface Props {
  children: ReactNode;
}

const AuthLayout: FC<Props> = ({ children }) => {
  const [imageIndex, setImageIndex] = useState(0);

  // Using placeholder images with gradient backgrounds
  const images = [authImage1, authImage2, authImage3, authImage4];

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); // Change image every 6 seconds (3 seconds for fade in and stay, 3 seconds for fade out)

    return () => clearInterval(interval);
  }, []);

  return (
    <Fragment>
      {/* <div className="flex lg:h-screen w-full"> */}
      {/* <div className="w-0 lg:w-1/2 h-full relative overflow-hidden">
          {images.map((image: any, index) => (
            <img
              key={index}
              className={`h-screen min-w-full object-cover absolute transition-opacity duration-3000 ease-in-out ${imageIndex === index ? "fadeIn" : "fadeOut"}`}
              src={image}
              alt={`authSideImage${index + 1}`}
            />
          ))}
        </div> */}
      <div className="w-full ">{children}</div>
      {/* </div> */}
    </Fragment>
  );
};

export default AuthLayout;
