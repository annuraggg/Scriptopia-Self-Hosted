;

const CandidateNavbar = () => {
  return (
    <div className="w-full px-5 py-3">
      <div className="flex justify-between">
        <div className="flex items-center">
          <img src="/logo.svg" alt="logo" className="w-7" />
          <p className="text-md ml-2 opacity-80">Campus</p>
        </div>
        {/* better auth component */}
        User Button Here
      </div>
    </div>
  );
};

export default CandidateNavbar;
