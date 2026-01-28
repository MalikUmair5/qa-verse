# Cloudinary Upload Preset Setup Guide

## Quick Fix - Create Upload Preset

You need to create an **unsigned upload preset** in your Cloudinary account:

### Step 1: Login to Cloudinary Console
Go to: https://cloudinary.com/console

### Step 2: Navigate to Upload Settings
1. Click on **Settings** (gear icon) in the top-right
2. Click on **Upload** tab

### Step 3: Create Upload Preset
1. Click **"Add upload preset"** button
2. Configure the preset:
   - **Preset name**: `ml_default` (or `unsigned_uploads`)
   - **Signing mode**: Select **"Unsigned"** 
   - **Folder**: `bug-attachments` (optional)
   - **Access mode**: Public read
   - **Resource type**: Auto
   - **Allowed formats**: jpg,jpeg,png,gif,pdf,txt,doc,docx,webp

### Step 4: Save Preset
Click **"Save"** button

### Step 5: Test Upload
Try uploading a file again - it should work now!

---

## Alternative Quick Setup

If you prefer a different approach, you can:

1. **Use existing preset**: If you have any existing unsigned preset, note its name
2. **Update the code**: Change the preset name in the code to match your existing preset

---

## Verification

After creating the preset, you can verify it exists by:
1. Going to Settings > Upload
2. Looking for your preset in the list
3. Ensuring it shows "Unsigned" in the Signing mode column

---

## Common Issues

**Issue**: Still getting preset errors after creation  
**Solution**: Wait 1-2 minutes after creating preset, then try again

**Issue**: Can't find Upload settings  
**Solution**: Make sure you're logged into the correct Cloudinary account (dp6ieblt3)

**Issue**: Don't see "Add upload preset" button  
**Solution**: You might not have admin permissions - contact your account admin