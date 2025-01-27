export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center justify-center h-dvh">
      <a
        href="#"
        className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-2 text-sm rounded-full border border-primary-600"
        role="alert"
      >
        <span className="text-xs bg-primary-600 rounded-full  px-4 py-1.5 mr-3">
          New
        </span>{" "}
        <span className="text-sm font-medium">
          Mailxl is out! See what's new
        </span>
        <svg
          className="ml-2 w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-center md:text-5xl lg:text-6xl ">
        The fastest way to Send Emails in Dubai
      </h1>
    </div>
  );
}
