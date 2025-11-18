const LoginPage = () => {
  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/auth/twitter/login`;
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center space-y-4">
        <h1 className="text-3xl font-bold">Chirp Deck</h1>
        <p className="text-slate-600">Manage multiple timelines and schedule tweets with ease.</p>
        <button
          onClick={login}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
        >
          Sign in with Twitter
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
