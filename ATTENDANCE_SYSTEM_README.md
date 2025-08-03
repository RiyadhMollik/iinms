# Meeting Attendance System

## Overview

The Meeting Attendance System is a comprehensive solution for managing meetings and tracking attendance for Agromet Scientists (roleId: 12). The system uses GPS location verification to ensure accurate attendance tracking within a 10-meter radius of the meeting location.

## Features

### 1. Meeting Management
- **Create Meetings**: Schedule meetings with title, description, date, time, and location
- **Location Selection**: Interactive map picker for selecting meeting coordinates
- **Time Management**: Set start and end times for meetings
- **Status Tracking**: Monitor meeting status (scheduled, ongoing, completed, cancelled)

### 2. Attendance Tracking
- **GPS Verification**: Automatic location verification within 10 meters of meeting location
- **Time Validation**: Attendance only accepted during meeting time window
- **Role-based Access**: Only users with roleId 12 (Agromet Scientists) can mark attendance
- **Late Detection**: Automatic detection of late arrivals (after 15 minutes from start time)

### 3. Reporting & Analytics
- **Attendance Summary**: View present, late, and absent participants
- **Detailed Reports**: Individual attendance records with check-in times and distances
- **Attendance Rate**: Calculate overall attendance percentage
- **Real-time Updates**: Live attendance tracking during meetings

## Database Schema

### Meeting Model
```javascript
{
  id: INTEGER (Primary Key)
  title: STRING (Required)
  description: TEXT
  meetingDate: DATE (Required)
  startTime: TIME (Required)
  endTime: TIME (Required)
  locationLat: DECIMAL(10,8) (Required)
  locationLng: DECIMAL(11,8) (Required)
  locationName: STRING
  createdBy: INTEGER (Foreign Key to User)
  status: ENUM('scheduled', 'ongoing', 'completed', 'cancelled')
}
```

### Attendance Model
```javascript
{
  id: INTEGER (Primary Key)
  meetingId: INTEGER (Foreign Key to Meeting)
  userId: INTEGER (Foreign Key to User)
  checkInTime: DATETIME (Required)
  checkInLat: DECIMAL(10,8) (Required)
  checkInLng: DECIMAL(11,8) (Required)
  distance: DECIMAL(10,2) (Distance in meters from meeting location)
  status: ENUM('present', 'absent', 'late')
  notes: TEXT
}
```

## API Endpoints

### Meeting Management
- `POST /api/meetings` - Create a new meeting
- `GET /api/meetings` - Get all meetings (with pagination and filters)
- `GET /api/meetings/:id` - Get meeting details with attendance
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting

### Attendance Management
- `POST /api/meetings/:meetingId/attendance` - Mark attendance for a user
- `GET /api/meetings/:meetingId/attendance-report` - Get detailed attendance report

## Frontend Components

### 1. Attendance.jsx
Main component for managing meetings and viewing attendance reports.

**Features:**
- Meeting list with search and filter capabilities
- Create meeting modal with form validation
- Interactive attendance tracking
- Detailed attendance reports with visual indicators

### 2. MapPicker.jsx
Interactive component for selecting meeting locations.

**Features:**
- Click-to-select location functionality
- Current location detection
- Manual coordinate input
- Visual location preview

## Usage Instructions

### Creating a Meeting
1. Navigate to the Attendance page
2. Click "Create Meeting" button
3. Fill in meeting details:
   - Title and description
   - Meeting date and time
   - Use the map picker to select location
   - Or manually enter coordinates
4. Click "Create Meeting"

### Marking Attendance
1. Ensure you have roleId 12 (Agromet Scientists)
2. Navigate to the meeting during its scheduled time
3. Click the attendance icon (users icon) next to the meeting
4. Allow location access when prompted
5. System will verify your location and mark attendance

### Viewing Attendance Reports
1. Click the eye icon next to any meeting
2. View attendance summary with counts
3. See detailed lists of present, late, and absent participants
4. Check individual check-in times and distances

## Location Verification Logic

The system uses the Haversine formula to calculate the distance between the meeting location and the user's check-in location:

```javascript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};
```

## Attendance Rules

1. **Eligibility**: Only users with roleId 12 can mark attendance
2. **Time Window**: Attendance can only be marked during the meeting's scheduled time
3. **Location**: User must be within 10 meters of the meeting location
4. **Late Detection**: Arrivals after 15 minutes from start time are marked as "late"
5. **Single Entry**: Users can only mark attendance once per meeting

## Security Features

- Role-based access control
- Location verification to prevent proxy attendance
- Time-based validation
- Duplicate attendance prevention
- Input validation and sanitization

## Error Handling

The system provides clear error messages for:
- Location access denied
- Distance too far from meeting location
- Meeting not active at current time
- User not eligible for attendance
- Duplicate attendance attempts

## Future Enhancements

1. **Real-time Notifications**: Push notifications for meeting reminders
2. **QR Code Attendance**: Alternative attendance method using QR codes
3. **Offline Support**: Cache meeting data for offline access
4. **Advanced Analytics**: Attendance trends and reporting
5. **Integration**: Calendar integration and email notifications
6. **Mobile App**: Dedicated mobile application for better UX

## Technical Requirements

- Node.js backend with Express
- React frontend with Tailwind CSS
- MySQL/PostgreSQL database
- Geolocation API support
- HTTPS for production (required for geolocation)

## Installation

1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

3. Set up database and run migrations
4. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

When contributing to this project, please ensure:
- All new features include proper error handling
- Location verification logic remains secure
- UI/UX follows the existing design patterns
- Database migrations are properly documented
- API endpoints include proper validation 