# Attachment Feature Implementation Guide

## Overview
This implementation adds file attachment functionality to bug reports with Cloudinary integration for secure file storage and delivery.

## Features Implemented

### 1. File Upload Component (`components/ui/fileUpload/index.tsx`)
- Drag & drop file upload
- Click to upload
- File type validation (images, PDFs, documents)
- File size validation (max 10MB)
- Loading states and error handling
- Progress indication

### 2. Attachment Display Component (`components/ui/attachmentCard/index.tsx`)
- Image preview for supported formats
- Download functionality
- External link to view files
- Remove attachment capability
- Responsive grid layout
- File type icons

### 3. Attachment Modal (`components/roles/tester/AttachmentModal.tsx`)
- Modal interface for adding attachments
- Shows existing attachments
- File upload with progress
- Help text and guidelines

### 4. API Integration (`lib/api/tester/bugReport.ts`)
- `addAttachmentToBugReport()` - Add new attachments
- `removeAttachmentFromBugReport()` - Remove attachments
- Proper TypeScript interfaces for attachment data

### 5. Cloudinary Integration (`lib/utils/cloudinary.ts`)
- Secure file upload to Cloudinary
- Error handling for upload failures
- Folder organization for bug attachments
- Support for multiple file types

## Updated Components

### BugReportsPage.tsx
- Added attachment preview in bug cards
- Added "Add Attachment" button (paperclip icon)
- Shows attachment count and preview
- Integrated AttachmentModal

### BugReportDetailPage.tsx
- Full attachment display with AttachmentList
- Add attachment button in header and empty state
- Better layout for attachment section
- Modal integration for new attachments

## File Structure
```
lib/
├── utils/
│   └── cloudinary.ts          # Cloudinary upload utilities
├── api/
│   └── tester/
│       └── bugReport.ts       # Updated with attachment APIs
components/
├── ui/
│   ├── fileUpload/
│   │   └── index.tsx          # File upload component
│   └── attachmentCard/
│       └── index.tsx          # Attachment display components
└── roles/
    └── tester/
        ├── AttachmentModal.tsx    # Attachment modal
        ├── BugReportsPage.tsx     # Updated with attachments
        └── BugReportDetailPage.tsx # Updated with attachments
```

## Configuration

### Environment Variables (.env.local)
```
CLOUDINARY_URL=cloudinary://194272541237616:03HVqsoqB0NSDwWwu_nGFuf9NzQ@dp6ieblt3
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dp6ieblt3
NEXT_PUBLIC_CLOUDINARY_API_KEY=194272541237616
```

### Cloudinary Setup Required
1. Go to Cloudinary Console
2. Navigate to Settings > Upload
3. Create an "Unsigned Upload Preset" named `unsigned_uploads`
4. Set folder to `bug-attachments` (optional)
5. Configure allowed formats: jpg, jpeg, png, gif, pdf, txt, doc, docx

## Usage

### For Users
1. **In Bug Reports List**: Click the paperclip icon on any bug card to add attachments
2. **In Bug Details**: Click "Add Attachment" button or "Add First Attachment" if none exist
3. **Upload Files**: Drag & drop or click to select files (max 10MB each)
4. **View Attachments**: Click on any attachment to view/download

### For Developers
```tsx
import { uploadToCloudinary } from '@/lib/utils/cloudinary'
import { addAttachmentToBugReport } from '@/lib/api/tester/bugReport'

// Upload file to Cloudinary
const fileUrl = await uploadToCloudinary(file, 'bug-attachments')

// Save to database
const attachment = await addAttachmentToBugReport(bugReportId, {
  file_url: fileUrl,
  file_name: file.name
})
```

## API Endpoints Expected
- `POST /bugs/reports/{id}/attachments/` - Add attachment
- `DELETE /bugs/reports/{id}/attachments/{attachment_id}/` - Remove attachment

## Error Handling
- File size validation (client-side)
- File type validation (client-side)
- Upload failure handling
- Network error handling
- User-friendly error messages via toast notifications

## Security Considerations
- Uses unsigned upload presets (no API secrets in client)
- File type restrictions
- File size limitations
- Cloudinary handles file validation and security

## Troubleshooting

### Common Issues
1. **Upload Preset Error**: Create `unsigned_uploads` preset in Cloudinary console
2. **File Type Error**: Check if file type is in allowed list
3. **Size Error**: Files must be under 10MB
4. **Network Error**: Check Cloudinary connectivity

### Testing
1. Test with different file types (images, PDFs, documents)
2. Test file size limits
3. Test drag & drop functionality
4. Test error scenarios (no internet, large files, invalid types)

## Future Enhancements
- Image compression before upload
- Multiple file selection
- Progress bars for large uploads
- Attachment comments/descriptions
- File versioning
- Bulk attachment operations