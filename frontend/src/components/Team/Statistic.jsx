const stats = [

  // Statistics object with an 'id', 'name', and 'value' property

  { id: 1, name: "Year of Experience", value: "20+" },
  { id: 2, name: "Clinic Location", value: "10+" },
  { id: 3, name: "Patient Satisfaction", value: "100%" },
];

export const Statistic = () => {
  return (
    <div className="bg-red-50 py-24 sm:py-32 my-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="mx-auto flex max-w-xs flex-col gap-y-4"
            >
              <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
