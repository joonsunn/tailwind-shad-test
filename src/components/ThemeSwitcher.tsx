const ThemeSwitcher = () => {
  function toggleTheme() {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="text-xl p-2 rounded-sm bg-white text-blue-800 outline-black outline outline-1 dark:bg-slate-900 dark:text-white dark:outline-orange-300"
    >
      Toggle Theme
    </button>
  );
};

export default ThemeSwitcher;
