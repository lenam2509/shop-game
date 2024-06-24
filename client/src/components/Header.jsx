import { Link } from "react-router-dom";
import { Links } from "../contants";
import { Drawer } from "./ui/Drawer";
import { useDispatch, useSelector } from "react-redux";
import https from "../config/https";
import { logout, updateUser } from "../redux/reducers/auth";
import { toast } from "react-toastify";
import { useEffect } from "react";

export const Header = () => {
  const { isAuth, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handLogOut = async () => {
    try {
      const res = await https.get("/auth/logout");
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message);
      } else if (res.status === 400) {
        toast.error(res.data.message);
      }
      dispatch(logout());
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await https.get("/users/me");
        dispatch(updateUser(res.data));
      } catch (error) {
        console.log(error);
      }
    };
    if (isAuth === true) {
      fetchUser();
    }
  }, []);

  return (
    <div className="py-4 border-b">
      <div className="lg:flex-row flex flex-col justify-between items-center gap-4">
        <p className="text-lg font-bold">
          <span className="text-red-500">Donate</span> để mua game chất lượng ❤️
        </p>
        <div className="flex relative">
          <input
            type="text"
            className="bg-gray-200 outline-none p-2 rounded w-[200px] md:w-[500px] placeholder:text-black"
            placeholder="Tìm kiếm game..."
          />
          <button className="p-2 bg-black rounded text-white absolute right-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
        <div className="flex gap-4 items-center text-lg font-bold">
          {isAuth ? (
            <div className="dropdown">
              <div className="flex flex-col" role="button" tabIndex={0}>
                <p>Hi, {user.username}</p>
                <p>Coin: {user.Coins.toLocaleString("vi-VN")}</p>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg text-md"
              >
                <li className="my-1">
                  <Link to="/profile">Thông tin cá nhân</Link>
                </li>
                <li className="my-1">
                  <Link to="/donate">Donate 💵</Link>
                </li>
                <li className="my-1">
                  <a onClick={handLogOut} className="bg-red-500 text-white">
                    Đăng xuất
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link className="hover:text-red-500" to="/register">
                Đăng ký
              </Link>
              <Link className="hover:text-red-500" to="/login">
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 px-4 md:px-0">
        <Link to={"/"}>
          <img src="/logo.svg" alt="logo" className="w-[150px]" />
        </Link>
        <div className=" gap-8 hidden lg:flex uppercase">
          {Links.map((link, i) => (
            <Link
              key={i}
              to={link.url}
              className="text-lg font-bold hover:text-red-500"
            >
              {link.title}
            </Link>
          ))}
        </div>

        <div className="lg:hidden cursor-pointer">
          <Drawer />
        </div>
      </div>
    </div>
  );
};
