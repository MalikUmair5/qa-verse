'use client'

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { aclonica } from '@/app/layout';
import Link from 'next/link';
import ProjectsPage from '@/components/roles/maintainer/projects/projects';

function ProjectsPageWithSuspense() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFFCFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A33C13]"></div>
      </div>
    }>
      <ProjectsPage />
    </Suspense>
  );
}

export default function Page() {
  return (
    <>
      <ProjectsPageWithSuspense />
    </>
  );
}