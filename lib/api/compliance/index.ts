import axiosInstance from '../axiosInstance';

export interface ComplianceAuditRequest {
  url: string;
}

export interface ComplianceAuditResponse {
  id: number;
  url: string;
  readiness_score: number;
  report_markdown: string;
  report_pdf: string;
  tech_stack_raw: string[];
  headers_raw: Record<string, string>;
  created_at: string;
}

export interface ReadinessStatus {
  status: 'Critical' | 'Improving' | 'Audit Ready';
  color: string;
  bgColor: string;
  meaning: string;
}

export const getReadinessStatus = (score: number): ReadinessStatus => {
  if (score >= 0 && score <= 40) {
    return {
      status: 'Critical',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      meaning: 'The site is an "easy target." Launching a bug bounty now would be too expensive because hackers will find hundreds of basic bugs instantly.'
    };
  } else if (score >= 41 && score <= 70) {
    return {
      status: 'Improving',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      meaning: 'Good foundations, but missing key protections (like CSP or secure headers). They are at risk of failing a SOC2 or ISO 27001 audit.'
    };
  } else {
    return {
      status: 'Audit Ready',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      meaning: 'The site is mature. It\'s ready for professional bug hunters to look for "deep" vulnerabilities rather than simple "low-hanging fruit."'
    };
  }
};

export const generateComplianceAudit = async (data: ComplianceAuditRequest): Promise<ComplianceAuditResponse> => {
  const response = await axiosInstance.post('/compliance/audit/', data);
  return response.data;
};

export const downloadPdfReport = (pdfPath: string): string => {
  // Construct the full URL for PDF download
  const baseUrl = 'http://127.0.0.1:8000';
  return `${baseUrl}${pdfPath}`;
};
