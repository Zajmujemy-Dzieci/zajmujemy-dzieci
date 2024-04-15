import { IconType } from "react-icons";
// import { GiTurtle, GiSquirrel, GiRat, GiSittingDog, GiCat, GiElephant, GiBearFace, GiRaven } from "react-icons/gi";
// import { IoFish } from "react-icons/io5";

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


import React, { Suspense, lazy, FunctionComponent } from 'react';
import { BsFillPersonFill } from "react-icons/bs";
// import { IconType } from 'react-icons';
import ClipLoader from "react-spinners/ClipLoader"; // A spinner component for the loading state

// Map your icons to their respective components
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
  // ... other icons
};

// LazyIcon component that accepts an iconName prop
const LazyIcon: FunctionComponent<{ iconName: string }> = ({ iconName }) => {
  const IconComponent = iconComponents[iconName] || iconComponents['default'];

  return (
    <Suspense fallback={<ClipLoader />}>
      <IconComponent />
    </Suspense>
  );
};

export default LazyIcon;