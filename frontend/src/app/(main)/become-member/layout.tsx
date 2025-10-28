import React from "react";

const BecomeMemberLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <div className="lg:p-18 mt-14 lg:mt-0">{children}</div>;
};

export default BecomeMemberLayout;
