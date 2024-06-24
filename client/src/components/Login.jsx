import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import https from "../config/https";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../redux/reducers/auth";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await https.post("/auth/login", data);
      dispatch(login(res.data));
      toast.success("Đăng nhập thành công");
      reset();
      // Redirect to back the last page
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  });

  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <h1 className="text-2xl font-bold text-red-500 uppercase">Đăng nhập</h1>
      <form onSubmit={onSubmit} className="md:w-[500px] w-full">
        <div className="flex flex-col gap-4">
          <input
            {...register("email")}
            type="text"
            placeholder="Email"
            className="border border-gray-300 p-2 rounded-md"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
          <input
            {...register("password")}
            type="password"
            placeholder="Mật khẩu"
            className="border border-gray-300 p-2 rounded-md"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          <button className="bg-red-500 text-white p-2 rounded-md flex justify-center">
            {isSubmitting ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 animate-spin "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
