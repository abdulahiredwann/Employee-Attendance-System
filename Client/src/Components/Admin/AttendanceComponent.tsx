import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import AttendanceService from "../../Services/attendaceService";
import toast, { Toaster } from "react-hot-toast";

interface EmployeeInfo {
  name: string;
  email: string;
  id: number;
  date: string;
}

function AttendanceComponent() {
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true); // Track scanning state
  const [isRequestPending, setIsRequestPending] = useState(false);

  useEffect(() => {
    const config = { fps: 10, qrbox: 250 };
    const qrCodeScanner = new Html5QrcodeScanner("qr-reader", config, false);

    if (isScanning) {
      qrCodeScanner.render(handleScanSuccess, handleScanFailure);
    }

    return () => {
      qrCodeScanner.clear().catch((error) => {
        console.error("Failed to clear QR Code scanner", error);
      });
    };
  }, [isScanning]);

  const handleScanSuccess = (decodedText: string) => {
    if (isRequestPending) return;

    setIsScanning(false); // Disable further scanning

    try {
      const [prefix, data] = decodedText.split(":");
      if (prefix === "Employee" && data) {
        const [email, firstName, lastName, date, idString] = data.split("-");
        const id = Number(idString);
        if (isNaN(id)) {
          throw new Error("Invalid ID format in QR code.");
        }

        const employeeInfo = {
          name: `${firstName} ${lastName}`,
          email: email,
          id: id,
          date: date,
        };
        setEmployeeInfo(employeeInfo);
        setError(null);

        // Process the scan data and handle request
        sendAttendance(employeeInfo);
      } else {
        throw new Error("Invalid QR code format");
      }
    } catch (err) {
      setError("Failed to parse QR code data.");
      setIsScanning(true); // Re-enable scanning on error
    }
  };

  const handleScanFailure = (error: any) => {
    setError("Error scanning QR code: " + error?.message);
    setIsScanning(true); // Re-enable scanning on failure
  };

  const sendAttendance = async (data: EmployeeInfo) => {
    setIsRequestPending(true);

    try {
      await AttendanceService(data); // Send request to server
      toast.success("Attendance saved successfully!");
      setIsRequestPending(false);
    } catch (error: any) {
      console.error("Error sending attendance request:", error);
      toast.error(error.response?.data || "An error occurred");
      setIsRequestPending(false);
    } finally {
      setIsRequestPending(false);
      setTimeout(() => {
        setIsScanning(true); // Re-enable scanning after delay
      }, 5000); // 5 seconds delay before enabling scanning again
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Toaster />
      <div>
        <h2 className="text-lg font-semibold mb-4">Scan QR Code</h2>
        <div id="qr-reader"></div>
        <p className="text-gray-500">
          Place the QR code in front of the camera
        </p>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="flex flex-col justify-center p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Employee Information</h2>
        {employeeInfo ? (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {employeeInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {employeeInfo.email}
            </p>
            <p>
              <strong>ID:</strong> {employeeInfo.id}
            </p>
            <p>
              <strong>Date:</strong> {employeeInfo.date}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No employee scanned yet.</p>
        )}
        {isRequestPending && (
          <div className="mt-4 p-4 bg-gray-200 rounded-lg text-center">
            <p>Processing, please wait...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceComponent;
