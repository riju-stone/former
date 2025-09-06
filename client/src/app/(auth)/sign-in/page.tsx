import Login from "@/components/custom/login";

export default function LoginPage() {

  return <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-8xl font-bold">Former</h1>
    <h2 className="text-2xl font-bold">A simple form builder</h2>
    <Login />
  </div>;
}
