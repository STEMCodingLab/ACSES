import React, { useState, useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userLoggedOut } from "../../../features/auth/userAuthSlice";
import { toast } from "react-hot-toast";
export const MainHeader = () => {
  const userAccessToken = localStorage.getItem("jwt");
  const [mobileSerach, setMobileSearch] = useState(false);
  const [profile, setProfile] = useState();

  useEffect(() => {
    
    fetch('https://vivid-bloom-0edc0dd8df.strapiapp.com/api/users/me?populate=Avatar&populate=Background', { // fetch API
      headers: {
        'Authorization': `Bearer ${userAccessToken}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setProfile(data);
      console.log(data,64789);
      localStorage.setItem('Avatar',data.Avatar.url)
    })
    .catch(error => console.error('Error fetching profile:', error));
  }, []);

  const avatarUrl = profile && profile.Avatar ? `${profile.Avatar.url}` : 'Default avatar address';


  return (
    <div className="w-full h-20 text-gray-100  px-2 sm:px-0 ">
      <div className="container mx-auto flex w-full h-full items-center justify-between space-x-3 relative">
        <div className="flex items-center space-x-3">

          {/* logo area */}
          <div className="xl:min-w-[300px]">
            <Link to="/">
              <div className="flex text-2xl text-black font-sans-serif">
              <span style={{ marginTop: '25px' }}>
                <img 
                  src="https://vivid-bloom-0edc0dd8df.media.strapiapp.com/SCL_High_Res_Logo_ca96671fc0.png" 
                  alt="Customer Logo" 
                  style={{ width: '150px', height: 'auto' }} 
                />
              </span>
                {/* <span style={{ paddingLeft: '12px' }}> STEM Coding Lab</span> */}
              </div>
            </Link>
          </div>
        </div>
        
        {/* right side */}
        <div className="flex items-center space-x-3 relative">
          {userAccessToken ? (
            <>
              <div className="flex items-center space-x-2 group hover:cursor-pointer" >
                 <Link
                    to="/profile"
                    className="flex hover:bg-orange-700/50 p-2 rounded-md ease-out duration-100">
                    <span>
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="rounded-full"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </span>
                    
                </Link>
                
                <span className="text-base mx-2">|</span>
                <div className="flex hover:bg-orange-700/50 p-2 text-black rounded-md ease-out duration-100">
                  <LogoutButton className="flex hover:bg-orange-700/50 p-2 rounded-md ease-out duration-100"/>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center">
              <Link
                to="/login"
                className="flex hover:bg-orange-700/50 p-2 text-black rounded-md ease-out duration-100"
              >
                <span className="text-2xl text-black pr-1">
                  <AiOutlineUser />
                </span>
                <span className="text-base font-medium">Login</span>
              </Link>
              
            </div>
            
          )}

          {/* search icon for small devices */}
          <button
            type="submit"
            className="pr-2 text-lg text-white block sm:hidden"
            onClick={() => setMobileSearch(!mobileSerach)}
          >
            <BsSearch />
          </button>

        </div>
      </div>
    </div>
  );
};

const LogoutButton = () => {
  const dispatch = useDispatch(); // use Redux
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear user data
    dispatch({ type: 'LOGOUT' }); // use Redux dispatch

    // remove jwt
    localStorage.removeItem('jwt'); // if use jwt
    // or：cookies.remove('jwt'); // if use cookie
    dispatch(userLoggedOut());
    toast.success("Logout SuccessFull");
    // redirect to login page
    navigate('/login');
  };

  return <button className="text-base font-medium" onClick={handleLogout}>Logout</button>;
};
