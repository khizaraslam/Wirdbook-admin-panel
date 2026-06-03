import { FC } from "react";

interface CustomMessageDisplayProps {
  show: boolean;
  title?: string;
  slogan?: string;
  image?: string; // path to image or gif
  imageAlt?: string;
  className?: string;
  titleClassName?: string;
  sloganClassName?: string;
  imageClassName?: string;
}

const CustomMessageDisplay: FC<CustomMessageDisplayProps> = ({
  show,
  title = "No Data Available",
  slogan = "",
  image,
  imageAlt = "Message illustration",
  className = "",
  titleClassName = "",
  sloganClassName = "",
  imageClassName = "",
}) => {
  if (!show) return null;

  return (
    <div
      className={`w-full flex flex-col items-center justify-center pt-4 ${className}`}
    >
      {image && (
        <div className={` ${imageClassName}`}>
          <img src={image} alt={imageAlt} className="max-w-full h-auto" />
        </div>
      )}

      {title && (
        <h3 className={`font-semibold text-lg text-blackie ${titleClassName}`}>
          {title}
        </h3>
      )}

      {slogan && (
        <p
          className={`text-gray-600 text-sm mt-2 text-center ${sloganClassName}`}
        >
          {slogan}
        </p>
      )}
    </div>
  );
};

export default CustomMessageDisplay;
