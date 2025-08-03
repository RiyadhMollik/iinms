import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  const API_URL = "https://iinms.brri.gov.bd/api/users/login";

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationPermission(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationPermission(false);
          toast.error('Location access denied. Meeting attendance features may be limited.');
        }
      );
    } else {
      setLocationPermission(false);
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  // Get location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber,
          password,
          userLat: userLocation?.lat,
          userLng: userLocation?.lng,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }

      // Store user ID in localStorage
      localStorage.setItem("userId", data.user.id);
      
      // Check if user is Agromet Scientist and has active meetings
      if (data.isAgrometScientist) {
        let message = "Welcome! ";
        
        // Check for auto-marked meetings
        if (data.autoMarkedMeetings && data.autoMarkedMeetings.length > 0) {
          const autoMarkedMessages = data.autoMarkedMeetings.map(meeting => 
            `✅ ${meeting.title}: ${meeting.message}`
          ).join('\n');
          message += `\n\n🎉 Attendance automatically marked for:\n${autoMarkedMessages}`;
        }
        
        // Check for other meetings (too far, etc.)
        if (data.otherMeetings && data.otherMeetings.length > 0) {
          const otherMessages = data.otherMeetings.map(meeting => 
            `ℹ️ ${meeting.title}: ${meeting.message}`
          ).join('\n');
          message += `\n\n📋 Other meetings:\n${otherMessages}`;
        }
        
        if (data.autoMarkedMeetings?.length > 0 || data.otherMeetings?.length > 0) {
          const shouldProceed = window.confirm(
            `${message}\n\nWould you like to proceed to the attendance page?`
          );
          
          if (shouldProceed) {
            window.location.href = '/attendance';
          } else {
            window.location.href = '/';
          }
        } else {
          // No active meetings
          window.location.href = '/';
        }
      } else {
        // Redirect to the home page
        window.location.href = '/';
      }
      
      toast.success("Login successful!");
          } catch (error) {
        toast.error("Login failed. Please try again.");
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#1F4E3B]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1F4E3B]">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="mobileNumber"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4E3B] focus:border-transparent"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4E3B] focus:border-transparent"
              required
            />
          </div>
          {error && (
            <div className="mb-4 text-center text-red-500 font-semibold">{error}</div>
          )}
          
          {/* Location Status */}
          {/* <div className="mb-4 p-3 rounded-lg border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Location Access:</span>
              <span className={`text-sm font-semibold ${locationPermission ? 'text-green-600' : 'text-red-600'}`}>
                {locationPermission ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
            {userLocation && (
              <div className="text-xs text-gray-500 mt-1">
                Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
              </div>
            )}
            {!locationPermission && (
              <div className="text-xs text-red-500 mt-1">
                Meeting attendance features may be limited without location access
              </div>
            )}
          </div> */}
          
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className={`bg-[#1F4E3B] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#17432E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F4E3B] ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
