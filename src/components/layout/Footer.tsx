const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ">
      <div className="container mx-auto py-6 text-center text-sm text-gray-600 dark:text-gray-400 space-y-3">
        <p>© {new Date().getFullYear()} laghuUrl. All Rights Reserved.</p>
        <div className="flex justify-center gap-6 text-xs">
          <a
            href="/privacy"
            className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
