const Footer = () => {
    return (
      <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  