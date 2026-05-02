import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

function MainLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

export default MainLayout;
