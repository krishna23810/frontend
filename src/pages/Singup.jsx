import { useForm, Controller } from "react-hook-form"
import { sendOtpApi, signup } from "../services/operation/AuthApi"
import { useDispatch } from "react-redux"
import OtpInput from 'react-otp-input';
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = (data) => {
    console.log(data)
    dispatch(signup(
      data.accountType,
      data.firstname,
      data.lastname,
      data.email,
      data.password,
      data.confirmPassword,
      data.otp,
      data.gender,
      data.contactNum
      , navigate)
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group flex flex-col gap-4 items-center">
        <div>
          <label className="text-lg font-bold">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            placeholder="Email"
          />
          {errors.email && <span>This field is required</span>}
        </div>

        <div>
          <label className="text-lg font-bold">First Name</label>
          <input
            type="string"
            {...register("firstname", { required: true })}
            placeholder="Krishna"
          />
          {errors.firstname && <span>This field is required</span>}
        </div>

        <div>
          <label className="text-lg font-bold">Last Name</label>
          <input
            type="string"
            {...register("lastname", { required: true })}
            placeholder="Agrawal"
          />
          {errors.lastname && <span>This field is required</span>}
        </div>

        <div>
          <label className="text-lg font-bold">Contact</label>
          <input
            type="string"
            {...register("contactNum", { required: true, minLength: 10, maxLength: 10 })}
            placeholder="9669070652"
          />
          {errors.contactNum && <span>This field is required and must be 10 digits</span>}
        </div>

        <div className="flex gap-4 items-center">
          <div>
            <label className="text-lg font-bold">Gender</label>
            <select {...register("gender", { required: true })}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span>This field is required</span>}
          </div>

          <div>
            <label className="text-lg font-bold">Account Type</label>
            <select {...register("accountType", { required: true })}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
            {errors.accountType && <span>This field is required</span>}
          </div>
        </div>

        <div>
          <label className="text-lg font-bold">Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            placeholder="Password"
          />
          {errors.password && <span>This field is required</span>}
        </div>

        <div>
          <label className="text-lg font-bold">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", { required: true })}
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && <span>This field is required</span>}
        </div>

        <div>
          <label className="text-lg font-bold">OTP</label>

          <Controller
            name="otp"
            control={control}
            rules={{ required: true, minLength: 6, maxLength: 6 }}
            render={({ field: { onChange, value } }) => (
              <OtpInput
                value={value || ''}
                onChange={onChange}
                numInputs={6}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  width: '3rem',
                  height: '3rem',
                  margin: '0 0.5rem',
                  fontSize: '1.5rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(0,0,0,0.3)',
                }}
              />
            )}
          />

          {errors.otp && <span>OTP is required and must be 6 digits</span>}

          <button
            type="button"
            onClick={() => {
              const email = watch("email");
              if (!email) {
                alert("Please enter a valid email before requesting OTP");
                return;
              }
              dispatch(sendOtpApi(email));
            }}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send OTP
          </button>
        </div>

        <input type="submit" className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer" />
      </div>
    </form>
  )
}
