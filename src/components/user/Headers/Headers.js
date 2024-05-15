import React from "react";
import { MainHeader } from "./MainHeader";
import { TopHeader } from "./TopHeader";
import { Landing } from "../../../pages/User/Home/Landing";

export const Headers = () => {
  const backgroundImageUrl = 'https://vivid-bloom-0edc0dd8df.strapiapp.com/uploads/1000_F_417784975_igb_Nz_Eo84_A9_Vr_P_Iafp_J6ho_U_Do_CVJ_656e_e3f2b8cdca.jpg';

  return (
    // <div style={{
    //   backgroundImage: `url("${backgroundImageUrl}")`,
    //   backgroundSize: 'cover',
    //   backgroundPosition: 'center'
    // }}>
    <div className="bg-gradient-to-r from-white to-blue-300">
      <MainHeader />
      <Landing/>  
    </div>
  );
};
