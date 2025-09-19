import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  BanknotesIcon,
  CreditCardIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

const paymentMethods = [
  {
    id: 1,
    name: "Cash on Delivery",
    value: "COD",
    icon: <BanknotesIcon className="h-5 w-5 text-gray-500" />,
  },
  {
    id: 2,
    name: "UPI",
    value: "UPI",
    icon: <QrCodeIcon className="h-5 w-5 text-green-600" />,
  },
  {
    id: 3,
    name: "Credit/Debit Card",
    value: "Card",
    icon: <CreditCardIcon className="h-5 w-5 text-blue-600" />,
  },
];

export default function PaymentDropdown({ value, onChange }) {
  const [selected, setSelected] = useState(
    paymentMethods.find((m) => m.value === value) || paymentMethods[0]
  );

  const handleSelect = (method) => {
    setSelected(method);
    onChange({ target: { name: "payment", value: method.value } });
  };

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={handleSelect}>
        <div className="relative mt-1">
          {/* Button */}
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm">
            <span className="flex items-center gap-2">
              {selected.icon}
              {selected.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          {/* Options */}
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {paymentMethods.map((method) => (
              <Listbox.Option
                key={method.id}
                value={method}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 flex items-center gap-2 ${
                    active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    {method.icon}
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {method.name}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                        <CheckIcon className="h-5 w-5" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
