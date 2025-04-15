const Button = ({ children, onClick, className, type = "button" }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`px-4 py-2 rounded-md font-medium transition-all ${className}`}
      >
        {children}
      </button>
    );
  };
  
  // ✅ Fix: Named export
  export { Button };
  