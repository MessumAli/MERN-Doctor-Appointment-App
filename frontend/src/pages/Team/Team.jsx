// Neccessary imports

import { Statistic } from "../../components/Team/Statistic";
import { TeamList } from "../../components/Team/TeamList";

export const Team = () => {
  return (
    <>
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">What Our Statistics Say</h2>
            <p className="text__para text-center">
              World-Class Care For Everyone. Our Health System Offers Unmatched,
              Expert Health Care.
            </p>
          </div>

          <Statistic />
        </div>
      </section>
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">Our Team</h2>
            <p className="text__para text-center">
              World-Class Care For Everyone. Our Health System Offers Unmatched,
              Expert Health Care.
            </p>
          </div>

          <TeamList />
        </div>
      </section>
    </>
  );
};
