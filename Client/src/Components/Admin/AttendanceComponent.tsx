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

  useEffect(() => {
    const config = { fps: 10, qrbox: 250 };
    const qrCodeScanner = new Html5QrcodeScanner("qr-reader", config, false);

    qrCodeScanner.render(handleScanSuccess, handleScanFailure);

    return () => {
      // Clear the QR code scanner instance when the component is unmounted
      qrCodeScanner.clear().catch((error) => {
        console.error("Failed to clear QR Code scanner", error);
      });
    };
  }, []);

  const handleScanSuccess = (decodedText: string) => {
    try {
      // Extract and parse the QR code data
      const [prefix, data] = decodedText.split(":");
      if (prefix === "Employee" && data) {
        const [email, firstName, lastName, date, idString] = data.split("-");

        // Convert the id to a number
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
      } else {
        throw new Error("Invalid QR code format");
      }
    } catch (err) {
      setError("Failed to parse QR code data.");
    }
  };

  const handleScanFailure = (error: any) => {
    setError("Error scanning QR code: " + error?.message);
  };

  const run = async (data: EmployeeInfo) => {
    try {
      await AttendanceService(data);
      toast.success("Saved in Attendance");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 ">
      <Toaster></Toaster>
      {/* Left Column: QR Code Scanner */}
      <div className="">
        <h2 className="text-lg font-semibold mb-4">Scan QR Code</h2>
        <div id="qr-reader" className=""></div>
        <p className="text-gray-500">
          Place the QR code in front of the camera
        </p>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* Right Column: Display Employee Info */}
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
              <strong>Key:</strong> {employeeInfo.date}
            </p>
            <button
              onClick={() => {
                run(employeeInfo);
              }}
              className="  btn btn-primary"
            >
              Submit
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-500">No employee scanned yet.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default AttendanceComponent;
