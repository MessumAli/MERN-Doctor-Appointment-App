// Neccessary imports

import Image1 from '../../assets/images/hero-img01.png';
import Image2 from '../../assets/images/hero-img02.png';
import Image3 from '../../assets/images/hero-img03.png';
import Image4 from '../../assets/images/doctor-img01.png';
import Image5 from '../../assets/images/doctor-img02.png';
import Image6 from '../../assets/images/doctor-img03.png';

// Define an array of people with information about different individuals

const people = [
  {
    name: "Dr. John Doe",
    role: "Cardiologist",
    imageUrl: Image1,
  },
  {
    name: "Dr. Jane Smith",
    role: "Pediatrician",
    imageUrl: Image2,
  },
  {
    name: "Dr. Michael Johnson",
    role: "Dermatologist",
    imageUrl: Image3,
  },
  {
    name: "Dr. Sarah Lee",
    role: "Oncologist",
    imageUrl: Image4,
  },
  {
    name: "Dr. James Brown",
    role: "Orthopedic Surgeon",
    imageUrl: Image5,
  },
  {
    name: "Dr. Emily Davis",
    role: "Neurologist",
    imageUrl: Image6,
  },
];

export const TeamList = () => {
  return (
    <div className="my-10 py-24 sm:py-32 bg-red-50">
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Meet our leadership
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Libero fames augue nisl porttitor nisi, quis. Id ac elit odio vitae
            elementum enim vitae ullamcorper suspendisse.
          </p>
        </div>
        <ul
          role="list"
          className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
        >
          {people.map((person) => (
            <li key={person.name}>
              <div className="flex items-center gap-x-6">
                <img
                  className="h-16 w-16 rounded-full"
                  src={person.imageUrl}
                  alt=""
                />
                <div>
                  <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
                    {person.name}
                  </h3>
                  <p className="text-sm font-semibold leading-6 text-indigo-600">
                    {person.role}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
