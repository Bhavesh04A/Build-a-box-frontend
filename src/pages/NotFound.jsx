function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-5xl font-bold text-indigo-700 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-4">Page Not Found</p>
      <a href="/" className="text-indigo-600 underline">Go to Home</a>
    </div>
  );
}
export default NotFound;
