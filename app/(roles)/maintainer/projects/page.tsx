'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { aclonica } from '@/app/layout';
import Link from 'next/link';
import ProjectsPage from '@/components/roles/maintainer/projects';



export default function Page() {
  return (
    <>
      <ProjectsPage />
    </>
  );
}