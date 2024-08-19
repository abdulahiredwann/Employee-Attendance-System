import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RegisterEmployeeService, {
  Response,
} from "../../Services/registerEmployee";
import { CiCircleInfo } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";

const schema = z.object({
  firstName: z
    .string()
    .min(3, "First Name must be 4 characters")
    .max(20, "First Name can be up to characters"),
  lastName: z
    .string()
    .min(3, "First Name must be 4 characters")
    .max(20, "First Name can be up to characters"),
  email: z.string().email("Invalid Email addres"),

  // Other Schema for later
});

export type RegisterEmployeeForm = z.infer<typeof schema>;
function RegisterEmployee() {
  const [newEmployeeInfo, setNewEmployeeInfo] = useState<
    Response | undefined
  >();
  const [ok, setOk] = useState<boolean>(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterEmployeeForm>({
    resolver: zodResolver(schema),
  });
  const run = async (data: RegisterEmployeeForm) => {
    try {
      const response = await RegisterEmployeeService(data);
      setNewEmployeeInfo(response);
      toast.success("Register Success!");
      setOk(true);
    } catch (error: any) {
      console.error("Error registering employee:", error);
      toast.error(error.response?.data || "An error occurred");
      setOk(false);
    }
  };

  const onSubmit = (data: RegisterEmployeeForm) => {
    run(data);
    ok && reset();
  };
  const formatID = (id: string) => {
    if (id.length === 2) {
      return `00-00-${id}`;
    } else if (id.length === 3) {
      return `00-0-${id}`;
    } else if (id.length === 4) {
      return `00-${id}`;
    }
    return `00-00-${id}`;
  };

  return (
    <>
      <Toaster></Toaster>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center justify-center min-h-screen ">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Register Employee
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  type="text"
                  id="firstName"
                  placeholder="Enter first name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.firstName && (
                  <p className="text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  type="text"
                  id="lastName"
                  placeholder="Enter last name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.lastName && (
                  <p className="text-red-500">{errors.lastName.message}</p>
                )}
              </div>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="">
          <div className="p-4">
            <div className="card bg-base-100  shadow-xl">
              <div className="p-9">
                <h2 className=" text-xl gap-2 font-extrabold mb-4 flex items-center">
                  <CiCircleInfo color="blue" size={25}></CiCircleInfo> New
                  Employee Info:
                </h2>
                <div className="flex items-center mb-2">
                  <p className="text-lg font-bold text-gray-700 mr-2">Name:</p>
                  <p className="text-lg font-mono  text-gray-900">
                    {newEmployeeInfo?.firstName} {newEmployeeInfo?.lastName}
                  </p>
                </div>
                <div className="flex items-center mb-2">
                  <p className="text-lg font-bold text-gray-700 mr-2">Email:</p>
                  <p className="text-lg font-extralight text-gray-900">
                    {newEmployeeInfo?.email}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="text-lg font-bold text-gray-700 mr-2">ID:</p>
                  <p className="text-lg text-gray-900">
                    {formatID(newEmployeeInfo?.id || "00")}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="text-lg font-bold text-gray-700 mr-2">
                    QR Code:
                  </p>
                  <img
                    src={`http://localhost:3000${newEmployeeInfo?.qrCode}`}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      </div>
    </>
  );
}

export default RegisterEmployee;
