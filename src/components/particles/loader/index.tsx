const Loader = () => {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm animate-in fade-in duration-300"
      style={{ zIndex: "var(--z-loader)" }}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        {/* Inner Ring (Slower & Reversed) */}
        <div className="absolute w-10 h-10 border-4 border-brand-500/10 border-b-brand-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
      </div>

      {/* Pulse Text */}
      <p className="mt-6 text-sm font-bold text-brand-600 tracking-widest uppercase animate-pulse font-outfit">
        Loading...
      </p>
    </div>
  );
};

export default Loader;
