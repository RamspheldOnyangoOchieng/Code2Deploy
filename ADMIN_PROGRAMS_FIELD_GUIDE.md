# Admin Programs Form - Field Guide

## Complete Form Structure

### Left Column (6 fields)

#### 1. Program Title * (Required)
```
Type: Text Input
Field: title
Placeholder: "e.g., Full-Stack Web Development"
Icon: fa-heading
Max Length: 200 characters
```

#### 2. Description * (Required)
```
Type: Textarea (4 rows)
Field: description
Placeholder: "Describe what students will learn..."
Icon: fa-align-left
```

#### 3. Duration * (Required)
```
Type: Text Input
Field: duration
Placeholder: "e.g., 12 Weeks"
Icon: fa-clock
Max Length: 50 characters
```

#### 4. Level * (Required)
```
Type: Select Dropdown
Field: level
Options: Beginner, Intermediate, Advanced
Icon: fa-layer-group
Default: Beginner
```

#### 5. Technologies * (Required)
```
Type: Text Input
Field: technologies
Placeholder: "e.g., HTML, CSS, JavaScript, React"
Icon: fa-code
Format: Comma-separated
Max Length: 255 characters
```

#### 6. Mode * (Required)
```
Type: Select Dropdown
Field: mode
Options: Online, Hybrid, On-site
Icon: fa-laptop
Default: Online
```

#### 7. Sessions Per Week
```
Type: Number Input
Field: sessions_per_week
Min: 1
Max: 7
Icon: fa-calendar-week
Default: 3
```

---

### Right Column (5 fields)

#### 8. Program Image
```
Type: File Input + URL Input
Field: image (URL) / imageFile (File)
Accept: image/*
Icon: fa-image
Shows: Preview of uploaded/entered image (40px height)
Max URL Length: 1000 characters
```

#### 9. Modules
```
Type: Textarea (3 rows)
Field: modules
Placeholder: "e.g., Introduction, HTML Basics, CSS Fundamentals"
Format: Comma-separated
```

#### 10. Prerequisites
```
Type: Textarea (3 rows)
Field: prerequisites
Placeholder: "e.g., Basic computer knowledge"
Icon: fa-check-circle
```

#### 11. Offers Certification
```
Type: Checkbox
Field: has_certification
Label: "Offers Certification"
Icon: fa-certificate (yellow)
Default: true
```

#### 12. Scholarship Available
```
Type: Checkbox
Field: scholarship_available
Label: "Scholarship Available"
Icon: fa-hand-holding-usd (green)
Default: true
```

---

## Form Validation Rules

### Required Fields (Must be filled):
1. ✅ Program Title
2. ✅ Description
3. ✅ Duration
4. ✅ Level
5. ✅ Technologies

### Optional Fields:
- Image (file upload or URL)
- Mode (has default: Online)
- Sessions Per Week (has default: 3)
- Modules
- Prerequisites
- Has Certification (has default: true)
- Scholarship Available (has default: true)

---

## Data Format Examples

### Technologies (comma-separated string):
```
"HTML/CSS, JavaScript, React, Node.js"
"Python, Pandas, NumPy, Scikit-learn"
"Unity, C#, 3D Modeling, Game Design"
```

### Modules (comma-separated string):
```
"HTML Fundamentals, CSS Styling, JavaScript Basics, React Framework, Node.js Backend, MongoDB Database, Full-Stack Project"
```

### Prerequisites (free text):
```
"Basic computer knowledge and internet access"
"JavaScript fundamentals and basic React knowledge"
"Strong Python skills, mathematics background (linear algebra, calculus), and basic machine learning knowledge"
```

### Duration (free text):
```
"12 Weeks"
"16 Weeks"
"10 Weeks"
```

---

## Modal Buttons

### Cancel Button
```
Style: Gray background (bg-gray-200)
Text: "Cancel" with X icon
Action: Closes modal, clears form, resets image
```

### Create/Update Button
```
Style: Gradient from cyan to blue (hover: gold gradient)
Text: "Create Program" or "Update Program" with icon
Action: Submits form to API, refreshes program list
```

---

## Color Coding

### Level Badges:
- **Beginner:** Green (bg-green-100 text-green-800)
- **Intermediate:** Yellow (bg-yellow-100 text-yellow-800)
- **Advanced:** Red (bg-red-100 text-red-800)

### Mode Badges:
- **Online:** Blue (bg-blue-100 text-blue-800)
- **Hybrid:** Purple (bg-purple-100 text-purple-800)
- **On-site:** Gray (bg-gray-100 text-gray-800)

### Feature Icons:
- **Certification:** Yellow certificate icon (fa-certificate)
- **Scholarship:** Green money icon (fa-hand-holding-usd)

---

## API Integration

### Create Program:
```
POST /api/admin/programs/
Content-Type: application/json
Authorization: Bearer <token>

Body: {
  title, description, duration, level, technologies, 
  image, mode, sessions_per_week, has_certification, 
  scholarship_available, prerequisites, modules
}
```

### Update Program:
```
PUT /api/admin/programs/{id}/
Content-Type: application/json
Authorization: Bearer <token>

Body: {
  title, description, duration, level, technologies, 
  image, mode, sessions_per_week, has_certification, 
  scholarship_available, prerequisites, modules
}
```

---

## Image Handling

### File Upload:
1. User selects image file
2. `handleImageChange()` triggered
3. File stored in `imageFile` state
4. FileReader creates preview
5. Preview stored in `imagePreview` state
6. Preview displayed below URL input

### URL Input:
1. User enters image URL
2. URL stored in `editForm.image`
3. If no file upload, URL displayed as preview

### Priority:
- If both file and URL exist, file preview shows
- Form submission uses URL (file upload to be implemented)

---

## Table Display

### Columns:
1. **Program** - Image thumbnail + title + description
2. **Level** - Color-coded badge
3. **Duration** - Plain text
4. **Mode** - Color-coded badge
5. **Technologies** - Truncated text
6. **Features** - Certification & scholarship icons
7. **Enrollments** - Count number
8. **Actions** - Edit & Delete buttons with icons

---

## Filters

### Search Filter:
```
Input: Text search
Searches: Title, description, technologies
Updates: On every keystroke (debounced)
```

### Level Filter:
```
Type: Dropdown
Options: All Levels, Beginner, Intermediate, Advanced
Updates: Immediately on selection
```

### Refresh Button:
```
Style: Gradient button with sync icon
Action: Refetches all programs from API
```

---

## State Management

### Form State:
```javascript
editForm: {
  title: '',
  description: '',
  duration: '',
  level: 'Beginner',
  technologies: '',
  image: '',
  mode: 'Online',
  sessions_per_week: 3,
  has_certification: true,
  scholarship_available: true,
  prerequisites: '',
  modules: ''
}
```

### Image State:
```javascript
imageFile: null,        // File object from input
imagePreview: ''        // Base64 string or URL
```

### Modal State:
```javascript
showCreateModal: false, // Create new program
showEditModal: false,   // Edit existing program
showDeleteModal: false  // Confirm deletion
```

---

## Usage Flow

### Creating a New Program:
1. Click "+ Add Program" button
2. Modal opens with empty form
3. Fill in required fields (5 fields)
4. Optionally upload image or enter URL
5. Set mode, sessions, checkboxes
6. Add modules and prerequisites
7. Click "Create Program"
8. Modal closes, table refreshes

### Editing a Program:
1. Click "Edit" on program row
2. Modal opens with pre-filled data
3. Modify any fields
4. Change or upload new image
5. Click "Update Program"
6. Modal closes, table refreshes

### Deleting a Program:
1. Click "Delete" on program row
2. Confirmation modal appears
3. Confirm deletion
4. Program removed from database
5. Table refreshes

---

**Note:** This form is fully responsive and supports both desktop and mobile layouts. The two-column layout collapses to single column on smaller screens.
