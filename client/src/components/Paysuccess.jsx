import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export const Paysuccess = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <h1 className=" text-green-500 font-bold text-2xl md:text-5xl uppercase">
        Thanh toán thành công
      </h1>
      <img src="/paysuccess.jpg" alt="" className="" />
      <div
        className="
        text-lg md:text-2xl font-bold text-green-500
      "
      >
        Bạn có tổng cộng {user?.Coins} coins trong tài khoản
      </div>
    </div>
  );
};
