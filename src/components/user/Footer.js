import React from "react";
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { Link } from "react-router-dom";


export const Footer = () => {
  return (
    <footer className="px-2 sm:px-0">
      <div className="w-full h-auto bg-gray-100">
        <div className="container mx-auto py-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
            <div className="">
            <div className="mt-4 space-y-3"> {/* Adjusted mt-4 (16px) and space-y-3 (12px) */}
              <p className="font-medium text-base mb-4" style={{ color: '#1F1F1F' }}>Contact Us</p> {/* Added mb-4 for 16px margin below title */}
              <div className="flex space-x-2">
                <p className="text-2xl text-green-900">
                  <AiOutlineWhatsApp />
                </p>
                <div className="text-sm">
                  <p style={{ color: '#1F1F1F' }}>Call Us</p>
                  <p style={{ color: '#1F1F1F' }}>+1 412-426-3523</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <p className="text-2xl text-green-900">
                  <AiOutlinePhone />
                </p>
                <div className="text-sm">
                  <p style={{ color: '#1F1F1F' }}>Fax</p>
                  <p style={{ color: '#1F1F1F' }}>+1 866-578-4147</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <p className="text-2xl text-green-900">
                  <AiOutlineMail />
                </p>
                <div className="text-sm">
                  <p style={{ color: '#1F1F1F' }}>Email Us</p>
                  <p style={{ color: '#1F1F1F' }}>info@stemcodinglab.org</p>
                </div>
              </div>
            </div>

            </div>
            <div className="">
            <div className="space-y-2 mt-2">
            </div>
            </div>
            <div className="">
            <div className="space-y-3 mt-2"> {/* Adjust space-y value for 12px between items */}
              <p className="font-medium text-base mb-4" style={{ color: '#1F1F1F' }}>Customer Services</p> {/* Add mb-4 for 16px margin below title */}
              <div className="flex flex-col space-y-3 font-normal" style={{ color: '#1F1F1F' }}> {/* 添加 space-y-3 类 */}
  <Link
    to="/"
    className="hover:text-blue-900 hover:ml-1 duration-100 ease-linear"
  >
    About Us
  </Link>
  <Link
    to="/"
    className="hover:text-blue-900 hover:ml-1 duration-100 ease-linear"
  >
    Terms & Conditions
  </Link>
  <Link
    to="/"
    className="hover:text-blue-900 hover:ml-1 duration-100 ease-linear"
  >
    FAQ
  </Link>
  <Link
    to="/"
    className="hover:text-blue-900 hover:ml-1 duration-100 ease-linear"
  >
    Privacy Policy
  </Link>
</div>

            </div>

            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};
