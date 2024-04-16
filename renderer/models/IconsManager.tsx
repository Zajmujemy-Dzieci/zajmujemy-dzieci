import { IconType } from "react-icons";
import React, { Suspense, lazy, FunctionComponent } from 'react';
import ClipLoader from "react-spinners/ClipLoader"; // A spinner component for the loading state

export const iconsMap = new Map<string, string>([
    ["żółw", "GiTurtle"],
    ["wiewiórka", "GiSquirrel"],
    ["mysz", "GiRat"],
    ["pies", "GiSittingDog"],
    ["kot", "GiCat"],
    ["słoń", "GiElephant"],
    ["miś", "GiBearFace"],
    ["ryba", "IoFish"],
    ["kruk", "GiRaven"],
    ["default", "BsFillPersonFill"]
]);

// Map the icons to their respective components
interface IconComponentsMap {
  [key: string]: React.LazyExoticComponent<IconType>;
}

const iconComponents: IconComponentsMap = {
  GiTurtle: lazy(() => import('react-icons/gi').then(module => ({ default: module.GiTurtle }))),
  GiSquirrel: lazy(() => import('react-icons/gi').then(module => ({ default: module.GiSquirrel }))),
  GiRat: lazy(() => import('react-icons/gi').then(module => ({ default: module.GiRat }))),
  GiSittingDog: lazy(() => import('react-icons/gi').then(module => ({ default: module.GiSittingDog }))),
  GiCat: lazy(() => import('react-icons/gi').then(module => ({ default: module.GiCat }))),
  GiElephant: lazy(() => import('react-icons/gi').then(module => ({ default: module.GiElephant }))),
  GiBearFace: lazy(() => import('react-icons/gi').then(module => ({ default: module.GiBearFace }))),
  IoFish: lazy(() => import('react-icons/io5').then(module => ({ default: module.IoFish }))),
  GiRaven: lazy(() => import('react-icons/gi').then(module => ({ default: module.GiRaven }))),
  BsFillPersonFill: lazy(() => import('react-icons/bs').then(module => ({ default: module.BsFillPersonFill }))),
};

// LazyIcon component that accepts an iconName prop - to increase loading speed
const LazyIcon: FunctionComponent<{ iconName: string, style?: React.CSSProperties, className?: string }> = ({ iconName, style, className }) => {
  const IconComponent = iconComponents[iconName] || iconComponents['default'];

  return (
    <Suspense fallback={<ClipLoader />}>
      <IconComponent style={{...style}} className={className}/>
    </Suspense>
  );
};

export default LazyIcon;