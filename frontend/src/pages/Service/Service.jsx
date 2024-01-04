// Neccessary imports

import { ServiceList } from "../../components/Service/ServiceList";
import { Testimonial } from "../../components/Testimonial/Testimonial";

export const Service = () => {
  return (
    <>
    <section>
      <div className="container">
        <div className="xl:w-[470px] mx-auto">
          <h2 className="heading text-center">Our Medical Services</h2>
          <p className="text__para text-center">
            World-Class Care For Everyone. Our Health System Offers Unmatched,
            Expert Health Care.
          </p>
        </div>

        <ServiceList />
      </div>
    </section>
     <section>
     <div className="container">
     <div className='xl:w-[470px] mx-auto'>
         <h2 className='heading text-center'>What Our Patients Say</h2>
         <p className='text__para text-center'>World-Class Care For Everyone. Our Health System Offers Unmatched,
           Expert Health Care.
         </p>
       </div>

       <Testimonial/>
     </div>
   </section>
   </>
  );
};
