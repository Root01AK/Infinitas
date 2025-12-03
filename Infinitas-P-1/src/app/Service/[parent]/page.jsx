"use client";

import React from "react";
import PageWithSection from "./[section]/page";

// This route handles URLs like /Service/project-management
// It simply delegates to the [parent]/[section] page.
// The [section] segment is optional so no specific service is preselected.

const ParentServicePage = () => {
  return <PageWithSection />;
};

export default ParentServicePage;
