import { useNavigate } from "react-router-dom"

function App() {

  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-8">
        <img src="/Tofu.jpg" alt="藤原豆腐店" className="w-80 rounded-2xl shadow-2xl"/>
        <div className="flex flex-col gap-4 w-80">
          <button className="py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-xl transition-all"
                  onClick={() => navigate("/order")}>下訂單</button>
          <button className="py-4 rounded-xl bg-gray-600 text-white font-bold text-lg hover:bg-gray-700 hover:shadow-xl transition-all"
                  onClick={() => navigate("/select-order")}>查訂單</button>
        </div>
      </div>
    </>
  )
}

export default App
