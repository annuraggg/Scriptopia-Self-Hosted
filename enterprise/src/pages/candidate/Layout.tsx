import CandidateNavbar from "@/components/CandidateNavbar";
import { useAuth } from "@/contexts/useAuth";
import { Organization } from "@shared-types/Organization";
import { Posting } from "@shared-types/Posting";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const [posting, _setPosting] = useState<Posting>({} as Posting);
  const [organization, _setOrganization] = useState<Organization>(
    {} as Organization
  );

  useEffect(() => {

  }, []);

  return (
    <div>
      {isAuthenticated ? (
        <>
          <CandidateNavbar />
          <Outlet context={{ posting, organization }} />
        </>
      ) : (
        <div>Please sign in</div>
      )}
    </div>
  );
};

export default Layout;
