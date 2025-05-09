import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { axiosInstance } from "../../API/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DoctorRegistration = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageError, setProfileImageError] = useState("");
  const [slots, setSlots] = useState([
    { day: "Monday", startTime: "", endTime: "" },
  ]);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    phone: Yup.string()
      .matches(/^\d{10,15}$/, "Enter a valid phone number")
      .required("Phone number is required"),
    specialization: Yup.string().required("Specialization is required"),
    experience: Yup.number()
      .typeError("Experience must be a number")
      .min(0, "Experience must be non-negative")
      .required("Experience is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      specialization: "",
      experience: "",
      email: "",
      password: "",
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!validateSlots()) return;
      if (!validateProfileImage()) return;

      const data = new FormData();
      for (const key in values) {
        data.append(
          key,
          key === "isActive" ? JSON.stringify(values[key]) : values[key]
        );
      }
      data.append("availableSlots", JSON.stringify(slots));
      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      try {
        const response = await axiosInstance.post(
          "/api/doctor/register",
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(response)
        toast.success("Doctor registration successful!");
        navigate("/doctor/dashboard");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImageError("");
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setProfileImageError("Only JPG, JPEG or PNG images are allowed.");
      return;
    }

    setProfileImage(file);
  };

  const validateProfileImage = () => {
    if (!profileImage) {
      setProfileImageError("Profile image is required.");
      return false;
    }
    return true;
  };

  const validateSlots = () => {
    const daySet = new Set();
    for (let i = 0; i < slots.length; i++) {
      const { day, startTime, endTime } = slots[i];
      if (!startTime || !endTime) {
        toast.error(`Start and end time required for slot ${i + 1}`);
        return false;
      }
      if (startTime >= endTime) {
        toast.error(`Start time must be before end time in slot ${i + 1}`);
        return false;
      }
      if (daySet.has(day)) {
        toast.error(`Duplicate day "${day}" in slot ${i + 1}`);
        return false;
      }
      daySet.add(day);
    }
    return true;
  };

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setSlots(updatedSlots);
  };

  const addSlot = () => {
    setSlots([...slots, { day: "Monday", startTime: "", endTime: "" }]);
  };

  const removeSlot = (index) => {
    if (slots.length > 1) {
      setSlots(slots.filter((_, i) => i !== index));
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 to-blue-900 px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Doctor Registration
          </h2>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            {/* Input fields with placeholders */}
            {[
              "name",
              "phone",
              "specialization",
              "experience",
              "email",
              "password",
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field}
                </label>
                <input
                  type={
                    field === "password"
                      ? "password"
                      : field === "email"
                      ? "email"
                      : field === "experience"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={`Enter your ${
                    field === "name"
                      ? "full name"
                      : field === "phone"
                      ? "phone number"
                      : field
                  }`}
                  className={`w-full px-4 py-2 border rounded focus:outline-none ${
                    formik.errors[field] && formik.touched[field]
                      ? "border-red-500"
                      : "focus:ring-2 focus:ring-indigo-500"
                  }`}
                />
                {formik.errors[field] && formik.touched[field] && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors[field]}
                  </p>
                )}
              </div>
            ))}

            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border rounded px-2 py-1 bg-white"
              />
              {profileImageError && (
                <p className="text-red-500 text-xs mt-1">{profileImageError}</p>
              )}
            </div>

            {/* Available Slots */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Available Slots
              </h3>
              {slots.map((slot, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Slot {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeSlot(index)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Day
                      </label>
                      <select
                        value={slot.day}
                        onChange={(e) =>
                          handleSlotChange(index, "day", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border rounded"
                      >
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          handleSlotChange(index, "startTime", e.target.value)
                        }
                        placeholder="Start time"
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          handleSlotChange(index, "endTime", e.target.value)
                        }
                        placeholder="End time"
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addSlot}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded mt-2 text-sm"
              >
                + Add Another Slot
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 rounded mt-4"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DoctorRegistration;
