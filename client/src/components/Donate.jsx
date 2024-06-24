import { useState } from "react";
import https from "../config/https";
import { useSelector } from "react-redux";

export const Donate = () => {
  const [amount, setAmount] = useState(0);
  const [err, setErr] = useState("");
  const { user } = useSelector((state) => state.auth);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (amount < 1000) {
      setErr("Số coins tối thiểu là 1000");
      return;
    }
    try {
      const res = await https.post("/order/create-payment", {
        amount: amount * 10,
        bankCode: "",
        language: "vn",
        user_id: user.id,
      });
      console.log(res);
      if (res.status === 200 || res.status === 201) {
        window.location.href = res.data.vnpUrl;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <span className="text-lg font-bold ">
        <span className="text-red-500">Donate</span> là hình thức vừa nạp tiền
        để mua game vừa ủng hộ web
      </span>
      <span className="text-xl font-bold text-red-400">
        1000coins = 10.000đ
      </span>
      <form onSubmit={onSubmit} className="flex flex-col w-[300px] gap-4 mt-4">
        <input
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          type="number"
          placeholder="Nhập số coins muốn mua"
          className="border-2 border-gray-200 p-2 rounded-lg"
        />
        {err && <span className="text-red-500">{err}</span>}
        <button
          type="submit"
          className="bg-red-500 text-white p-2 font-bold rounded-lg"
        >
          Nạp tiền
        </button>
      </form>
    </div>
  );
};
