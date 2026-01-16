import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {

  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    setError('')

    const res = await fetch('/api/admins/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, password })
    })

    if (!res.ok) {
      setError('帳號或密碼錯誤')
      return
    }

    navigate('/dashboard')

  }

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full space-y-4">
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-center mb-6">管理員登入</h1>

            <input className="mb-4 border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={name}
              placeholder="帳號"
              onChange={e => setName(e.target.value)}/>

            <input className="mb-4 border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              type="password"
              placeholder="密碼"
              value={password}
              onChange={e => setPassword(e.target.value)}/>

            {error && (<div className="mb-4 text-red-500 text-center font-medium">{error}</div>)}

            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                    onClick={login}>登入</button>
          </div>

        </div>
      </div>
  )
}

export default Admin
