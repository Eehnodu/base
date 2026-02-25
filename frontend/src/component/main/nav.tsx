const MainNav = ({ component, setComponent }) => {
  const navs = [
    "Button",
    "Toggle",
    "Box",
    "Area",
    "Modal",
    "Table",
    "Calendar",
  ];

  return (
    <>
      <nav className="w-full flex flex-col gap-3 px-6 p-3 text-gray-600">
        {navs.map((nav, idx) => (
          <span
            key={idx}
            className={`hover:text-black cursor-pointer
              ${
                component == nav.toLocaleLowerCase()
                  ? "font-bold text-black"
                  : ""
              }
              `}
            onClick={() => setComponent(nav.toLowerCase())}
          >
            {nav}
          </span>
        ))}
      </nav>
    </>
  );
};

export default MainNav;
