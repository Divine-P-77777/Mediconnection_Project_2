const Card = ({ children, className }) => {
    return (
      <div className={`border shadow-md rounded-lg  ${className}`}>
        {children}
      </div>
    );
  };
  
  const CardHeader = ({ children, className }) => {
    return <div className={`mb-4 font-semibold text-lg ${className}`}>{children}</div>;
  };
  
  const CardTitle = ({ children, className }) => {
    return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
  };
  
  const CardContent = ({ children, className }) => {
    return <div className={className}>{children}</div>;
  };

  const CardDescription = ({ children, className }) => {
    return <p className={`text-gray-500 ${className}`}>{children}</p>;
  };
  
  export { Card, CardHeader, CardTitle, CardContent, CardDescription };
  
  

  